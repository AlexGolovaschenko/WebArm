""" 
    MQTT topics:
    ci-cloud/<gateway token>/ping       - for ping gateway connection
    ci-cloud/<gateway token>/com        - for communication
    ci-cloud/<gateway token>/control    - for change gateway configuration

    <gateway token> - is registration token, assigned by ci-cloud,
                      is 20 characters string, like: KJSFIRBJNUIDCIDKFMGJ

    */com  reques example (JSON):    
    {"id":12566, "f":16, "adr":16, "r":25, "n":4}
    where:  
        id  - device id (should be returned in response)
        adr - device address
        f   - modbus function (string)
        r   - first register (should be returned in response)
        n   - count of registers

    */com  response example (JSON):   
    {"id":12566, "s":0, "r":25, "v":[0, 255, 761, 15]}
    where:
        id  - device id
        s   - status code (0 - OK, other - error code)
        r   - first register
        v   - list of registers values

"""
#-------------------------------------------------------------------------------
import json
import struct
import paho.mqtt.client as paho
from paho import mqtt
from paho.mqtt.subscribeoptions import SubscribeOptions

from .models import Connector
from .utils import update_tag_value
from .choices import CONNECTOR_MQTT_1

from devices.models import Device
from devices.choices import (DEVICE_PROTOCOL_MODBUS_RTU, 
    DEVICE_PROTOCOL_MODBUS_ASCII, DEVICE_PROTOCOL_MODBUS_TCP)

from tags.models import Tag
from tags.choices import (DATA_TYPE_INT, DATA_TYPE_FLOAT, DATA_TYPE_STRING, 
    DATA_TYPE_BOOL, TAG_VALUE_QUALITY_GOOD, TAG_VALUE_QUALITY_BAD)


CLIENT_NAME = 'mqtt_gateway_test1'
CLIENT_PASSWORD = 'asd234zxc567'
BROKER_URL = "595b78ccc9d347e99cf142b447e719cd.s1.eu.hivemq.cloud"
BROKER_PORT = 8883
TOPIC_TEMPLATE = 'ci-cloud/{token}/{topic}'


class MqttClient:
    def __init__(self):
        print('start MQTT connection')
        self._callbacks = {
            'on_connect': [],   # execute when client connected to the broker
            'on_subscribe': [], # execute when client subscribe for topic
            'on_message': [],   # execute when client get message from broker
            'on_publish': [],   # execute when client published a message 
        }
        self.client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
        self.client.on_connect = self._on_connect
        self.client.on_subscribe = self._on_subscribe
        self.client.on_message = self._on_message
        self.client.on_publish = self._on_publish
        self.client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS) # enable TLS for secure connection
        self.client.username_pw_set(CLIENT_NAME, CLIENT_PASSWORD)
        self.client.connect(BROKER_URL, BROKER_PORT)

    def subscribe(self, topic):
        # subscribe for the topic
        # "example/#" - you can subscribe to all topics of "example/" by using the wildcard "#"
        options = SubscribeOptions(qos=1, noLocal=True)
        self.client.subscribe(topic, options=options)

    def publish(self, topic, value):
        # publish value for topics
        self.client.publish(topic, value, qos=1)

    def registry_callback(self, event, callback):
        if event not in self._callbacks:
            print(f'Callback registaration error, the {event} does not exist.')
            return
        self._callbacks[event].append(callback) 

    def remove_callbacks(self, event):
        if event not in self._callbacks:
            return
        self._callbacks[event] = []

    def loop_start(self):
        self.client.loop_start()
        # finish loop on close the module
        import atexit
        atexit.register(self.loop_stop)

    def loop_stop(self):
        print('close MQTT connection')
        self.client.loop_stop()

    def _on_connect(self, client, userdata, flags, rc, properties=None):
        self._execute_callbacks('on_connect', self, userdata, flags, rc, properties)

    def _on_publish(self, client, userdata, mid, properties=None):
        self._execute_callbacks('on_publish', self, userdata, mid, properties)

    def _on_subscribe(self, client, userdata, mid, granted_qos, properties=None):
        self._execute_callbacks('on_subscribe', self, userdata, mid, granted_qos, properties)
 
    def _on_message(self, client, userdata, msg):
        self._execute_callbacks('on_message', self, userdata, msg)

    def _execute_callbacks(self, event, *args, **kwargs):
        for cb in self._callbacks[event]:
            try:
                cb(*args, **kwargs)
            except Exception as e:
                print('Error while try to execute a callback:', e)


#-------------------------------------------------------------------------------
class PullQueue:
    def __init__(self):
        self._pull_queue = {}
        self.init_pull_queue()

    def init_pull_queue(self):
        # collect list of connectors with theirs devices and tags
        mqtt_connectors = Connector.objects.filter(connector_type=CONNECTOR_MQTT_1)
        for con in mqtt_connectors:
            self._pull_queue[con.id] = {'weating_for_response':False, 'devices':{}}
            devices = con.device_set.all()
            for d in devices:
                self._pull_queue[con.id]['devices'][d.id] = {
                    'device': d,
                    'tags': {},
                    'done': False
                    }
                tags = d.tag_set.all()
                for t in tags:
                    self._pull_queue[con.id]['devices'][d.id]['tags'][t.id] = {'tag':t, 'done':False}

    def next(self, many=False):
        # Return the next tag for pulling 
        # or list of tags if many=True
        items = []
        for con_id, con_props in self._pull_queue.items():
            # skip if connector is weating for responce from device
            if self._pull_queue[con_id]['weating_for_response']:
                continue
            next_tag = self._find_next(con_id, con_props)
            if next_tag:
                if many:
                    items.append(next_tag)
                else:
                    items = next_tag
                    break
        return items if items else None

    def set_connector_busy(self, con_id):
        self._pull_queue[con_id]['weating_for_response'] = True

    def reset_connector_busy(self, con_id):
        self._pull_queue[con_id]['weating_for_response'] = False

    def set_device_done(self, con_id, dev_id):
        self._pull_queue[con_id]['devices'][dev_id]['done'] = True

    def set_tag_done(self, con_id, dev_id, tag_id):
        self._pull_queue[con_id]['devices'][dev_id]['tags'][tag_id]['done'] = True

    def reset_all_done_flags(self, con_id, con_props):
        for dev_id, dev_props in self._pull_queue[con_id]['devices'].items():
            dev_props['done'] = False
            tags = dev_props.get('tags', {})
            for tag_id, tag_props in tags.items():
                tag_props['done'] = False

    def _find_next(self, con_id, con_props):
        while True:
            dev_id, dev_props = self._find_next_device(con_props)
            if dev_props is None:
                # all devices was pulled (reset done flag and return)
                self.reset_all_done_flags(con_id, con_props)
                return
            tag_id, tag_props = self._find_next_tag(dev_props)
            if tag_props is None:
                # all tags was pulled (set the done flag and go to the next device)
                self.set_device_done(con_id, dev_id)
                continue
            else:
                # tag is found (exit from cycle)
                break
        return tag_props['tag']

    def _find_next_device(self, con_props):
        # return the next device from queue for pulling
        for dev_id, dev_props in con_props['devices'].items():
            dev_done = dev_props.get('done', True)
            dev = dev_props.get('device', None)
            if dev_done or (dev is None):
                continue
            return dev_id, dev_props
        else:
            return None, None

    def _find_next_tag(self, dev_props):
        # return the next tag from queue for pulling
        tags = dev_props.get('tags', {})
        for tag_id, tag_props in tags.items():
            tag_done = tag_props.get('done', True)
            tag = tag_props.get('tag', None)
            if tag_done or (tag is None):
                continue
            return tag_id, tag_props
        else:
            return None, None


#-------------------------------------------------------------------------------
class PullHandler:
    def __init__(self, mqtt_client, pull_queue, device_com):
        self._mqtt = mqtt_client
        self._queue = pull_queue
        self._com = device_com
        self._mqtt.registry_callback('on_connect', self.print_on_connect)
        self._mqtt.registry_callback('on_publish', self.print_on_publish)
        self._mqtt.registry_callback('on_subscribe', self.print_on_subscribe)
        self._mqtt.registry_callback('on_message', self.print_on_message)
        self._mqtt.registry_callback('on_message', self.handle_response)

    def subscribe(self, topic='ci-cloud/#'):
        self._mqtt.subscribe(topic)
        self._mqtt.loop_start()

    def print_on_connect(self, client, userdata, flags, rc, properties=None):
        print("MQTT CONNACK received with code %s." % rc)

    def print_on_publish(self, client, userdata, mid, properties=None):
        print("MQTT published: mid-" + str(mid))

    def print_on_subscribe(self, client, userdata, mid, granted_qos, properties=None):
        print("MQTT subscribed: " + str(mid) + " " + str(granted_qos))

    def print_on_message(self, client, userdata, msg):
        print("MQTT received:" + msg.topic + " " + str(msg.qos) + " " + str(msg.payload))

    def make_requests(self):
        if self._mqtt is None:
            raise Exception('MQTT Client is not provided')
        tags_list = self._queue.next(many=True)
        if tags_list is None:
            print('Queue is empty OR all connectors are busy')
            return
        for tag in tags_list:
            self._make_request(tag)

    def handle_response(self, client, userdata, msg):
        cloud, token, topic = msg.topic.split('/')
        connector = self._fined_connector_by_token(token)
        if   topic == 'ping':    self._handle_ping_response(connector, msg.payload)
        elif topic == 'com':     self._handle_com_response(connector, msg.payload)
        elif topic == 'control': self._handle_control_response(connector, msg.payload)
        else: print(f'invalide topic: {msg}')

    def ping_connection(self, connector):
        token = _get_connector_token(connector)
        topic = TOPIC_TEMPLATE.format(token=token, topic='ping')
        request = 'ping'
        self._mqtt.publish(topic, request)

    def _make_request(self, tag):
        connector = tag.device.connector
        token = connector.token
        topic = TOPIC_TEMPLATE.format(token=token, topic='com')
        device = tag.device
        request = self._com.create_com_request(device, tag)
        self._mqtt.publish(topic, request)
        self._queue.set_connector_busy(connector.id)
        self._queue.set_tag_done(connector.id, device.id, tag.id)

    def _handle_com_response(self, connector, response):
        response = self._parse_payload(response)
        self._queue.reset_connector_busy(connector.id)
        return self._com.handle_com_response(connector, response)

    def _handle_ping_response(self, connector, response):
        if not connector: 
            return None
        connector.refresh()
        if response.payload == 'pong':
            # this is correct answer
            pass
        else:
            # this is wrong answer
            pass

    def _handle_control_response(self, connector, response):
        # do nothing for now
        pass

    def _parse_payload(self, payload):
        try:
            return json.loads(payload)
        except json.decoder.JSONDecodeError:
            print(f'MQTT error: JSON decode error')
            return {}

    def _fined_connector_by_token(self, token):
        try:
            connector = Connector.objects.get(token=token)
        except Connector.DoesNotExist:
            print(f'MQTT error: Connector with token {token} does not exists')
            connector = None
        return connector


#-------------------------------------------------------------------------------
class DeviceCom:
    def create_com_request(self, device, tag, value=None):
        # reques example (JSON): {"id":12566, "f":16, "adr":16, "r":25, "n":4}
        if device.id != tag.device.id:
            raise Exception(f'The tag {tag} does not belong to the device {device}')

        # select modbus function
        # TODO: for now supported only reading functions
        if value is None:
            mb_function = tag.modbustagparameters.read_function
        else:
            raise Exception('Write function is not supported yet')
            mb_function = tag.modbustagparameters.write_function

        payload = {
            'id': tag.device.id,
            'adr': self._get_device_modbus_address(tag.device),
            'r': tag.modbustagparameters.register_address,
            'f': mb_function,
            'n': self._get_tag_register_size(tag),
        }
        try:
            return json.dumps(payload)
        except:
            print(f'MQTT error: Error on dump request data to JSON')
            return None

    def handle_com_response(self, connector, response):
        # response example (JSON): {"id":12566, "s":0, "r":25, "v":[0, 255, 761, 15]}
        # get connector by token
        if not connector: return None
        connector.refresh()

        # get device by modbus address and connector
        device = self._fined_device_by_id(connector, response.get('id', None))
        if not device: return None

        # get tags by register address and device
        tag = self._fined_tag_by_register_adr(device, response.get('r', None))
        if not tag: return None
        
        # convert received value to tag data type
        values = response.get('v', None)
        swap = self._check_need_to_swap_registers(device)
        tag_value = self._convert_registars_list_to_tag_value(values, tag.data_type, swap=swap)
        if not values: return None

        # quality
        connection_status = response.get('s', None)
        if connection_status is None:
            print(f'MQTT error: Device connection status not provided')
            quality = TAG_VALUE_QUALITY_GOOD
        elif connection_status == 0:
            quality = TAG_VALUE_QUALITY_GOOD
        else:
            quality = TAG_VALUE_QUALITY_BAD

        # modify tag value
        update_tag_value(tag, tag_value, quality)
        print(tag_value)

    def _fined_device_by_id(self, connector, device_id):
        if not device_id: 
            print(f'MQTT error: Device.get - Device id not provided')
            return None
        try:
            device = Device.objects.get(pk=device_id, connector=connector)
            return device
        except Device.DoesNotExist:
            print(f'MQTT error: Device.get - Object does not exist')
            return None
        except Device.MultipleObjectsReturned:
            print(f'MQTT error: Device.get - Multiple objects returned')
            return None

    def _get_device_modbus_address(self, device):
        if device.protocol_type == DEVICE_PROTOCOL_MODBUS_RTU:
            return device.protocol_mb_rtu.device_address
        elif device.protocol_type == DEVICE_PROTOCOL_MODBUS_ASCII:
            return device.protocol_mb_ascii.device_address
        elif device.protocol_type == DEVICE_PROTOCOL_MODBUS_TCP:
            return device.protocol_mb_tcp.device_ip    

    def _fined_tag_by_register_adr(self, device, register_adr):
        if not register_adr: 
            print(f'MQTT error: Tag.get - Register address not provided')
            return None
        try:
            tag = Tag.objects.get(device=device, modbustagparameters__register_address=register_adr)
            return tag
        except Tag.DoesNotExist:
            print(f'MQTT error: Tag.get - Object does not exist')
            return None
        except Tag.MultipleObjectsReturned:
            print(f'MQTT error: Tag.get - Multiple objects returned')
            return None        

    def _get_tag_register_size(self, tag):
        if tag.data_type == DATA_TYPE_INT: return 1
        elif tag.data_type == DATA_TYPE_FLOAT: return 2
        elif tag.data_type == DATA_TYPE_STRING: return 1
        elif tag.data_type == DATA_TYPE_BOOL: return 1
        else: 
            raise Exception(f'Tag datatype "{tag_datatype}" is not supported')

    def _convert_registars_list_to_tag_value(self, regs_list, tag_datatype, swap=True):
        if not isinstance(regs_list, list): 
            print(f'MQTT error: Registers values is not a list: {regs_list}')
            return None
        if tag_datatype == DATA_TYPE_INT: 
            return int(regs_list[0])
        elif tag_datatype == DATA_TYPE_FLOAT: 
            return self._convert_registers_to_float(regs_list[:2], swap=swap)
        elif tag_datatype == DATA_TYPE_STRING: 
            return str(regs_list[0])
        elif tag_datatype == DATA_TYPE_BOOL: 
            return regs_list[0] > 0
        else: 
            raise Exception(f'Tag datatype "{tag_datatype}" is not supported')

    def _convert_registers_to_float(self, registers, swap=True):
        a, b = (registers[1], registers[0]) if swap else (registers[0], registers[1])
        try:
            return struct.unpack('>f', bytes.fromhex(f"{a:0>4x}" + f"{b:0>4x}"))[0]
        except:
            print(f'MQTT error: Error on try to convert registers to float')
            return None

    def _check_need_to_swap_registers(self, device):
        if device.protocol_type == DEVICE_PROTOCOL_MODBUS_RTU:
            return device.protocol_mb_rtu.lower_register_forward
        elif device.protocol_type == DEVICE_PROTOCOL_MODBUS_ASCII:
            return device.protocol_mb_ascii.lower_register_forward
        elif device.protocol_type == DEVICE_PROTOCOL_MODBUS_TCP:
            return device.protocol_mb_tcp.lower_register_forward    


#-------------------------------------------------------------------------------
# use example
def use_example_app():
    mqtt = PullHandler()
    queue = PullQueue()
    com = DeviceCom()
    handler = PullHandler(mqtt, queue, com)

    while True:
        handler.make_requests()


#-------------------------------------------------------------------------------



#-------------------------------------------------------------------------------



# #-------------------------------------------------------------------------------
# class PullHandler:
#     def __init__(self):
#         self._pull_queue = {}
#         self._mqtt_client = None
#         self.reinit_pull_queue()
#         self._connect_mqtt()
#         self._subscribe_mqtt()

#     def reinit_pull_queue(self):
#         # collect list of connectors with theirs devices
#         mqtt_connectors = Connector.objects.filter(connector_type=CONNECTOR_MQTT_1)
#         for con in mqtt_connectors:
#             self._pull_queue[con.id] = {'weating_for_response':False, 'devices':{}}
#             devices = con.device_set.all()
#             for d in devices:
#                 self._pull_queue[con.id]['devices'][d.id] = {
#                     'device': d,
#                     'tags': {},
#                     'done': False
#                     }
#                 tags = d.tag_set.all()
#                 for t in tags:
#                     self._pull_queue[con.id]['devices'][d.id]['tags'][t.id] = {'tag':t, 'done':False}

#     def make_requests(self):
#         if self._mqtt_client is None:
#             raise Exception('MQTT Client is not inited')
#         for con_id, con_props in self._pull_queue.items():
#             # skip if connector is weating for responce from device
#             if self._pull_queue[con_id]['weating_for_response']:
#                 # TODO: check timeout
#                 print('connector is weating for response')
#                 continue
#             self._make_request(con_id, con_props)

#     def on_response(self):
#         pass

#     def _connect_mqtt(self):
#        if self._mqtt_client is None:
#             self._mqtt_client = MqttClient()

#     def _subscribe_mqtt(self):
#         self._mqtt_client.subscribe('ci-cloud/#')
#         self._mqtt_client.loop_start()
#         # stop loop on close module
#         import atexit
#         atexit.register(self._mqtt_client.loop_stop)

#     def _make_request(self, con_id, con_props):
#         while True:
#             dev_id, dev_props = self._get_next_device(con_props)
#             if dev_props is None:
#                 # all devices was pulled (reset done flag and return)
#                 self._reset_all_done_flags(con_id, con_props)
#                 return

#             tag_id, tag_props = self._get_next_tag(dev_props)
#             if tag_props is None:
#                 # all tags was pulled (set the done flag and go to the next device)
#                 self._pull_queue[con_id]['devices'][dev_id]['done'] = True
#                 continue
#             else:
#                 # tag is found (exit from cycle)
#                 break
 
#         # request the tag
#         dev = dev_props['device']
#         tag = tag_props['tag']
#         publish_tag_request(self._mqtt_client, dev.connector, dev, tag)
#         # self._pull_queue[con_id]['weating_for_response'] = True
#         self._pull_queue[con_id]['devices'][dev_id]['tags'][tag_id]['done'] = True


#     def _get_next_device(self, con_props):
#         # return the next device from queue for pulling
#         for dev_id, dev_props in con_props['devices'].items():
#             dev_done = dev_props.get('done', True)
#             dev = dev_props.get('device', None)
#             if dev_done or (dev is None):
#                 continue
#             return dev_id, dev_props
#         else:
#             return None, None

#     def _get_next_tag(self, dev_props):
#         # return the next tag from queue for pulling
#         tags = dev_props.get('tags', {})
#         for tag_id, tag_props in tags.items():
#             tag_done = tag_props.get('done', True)
#             tag = tag_props.get('tag', None)
#             if tag_done or (tag is None):
#                 continue
#             return tag_id, tag_props
#         else:
#             return None, None

#     def _reset_all_done_flags(self, con_id, con_props):
#         for dev_id, dev_props in self._pull_queue[con_id]['devices'].items():
#             dev_props['done'] = False
#             tags = dev_props.get('tags', {})
#             for tag_id, tag_props in tags.items():
#                 tag_props['done'] = False



# def init_mqtt():
#     global MQTT
#     if MQTT is None:
#         MQTT = MqttClient()
#     # subscribe to broker
#     MQTT.subscribe('ci-cloud/#')
#     MQTT.loop_start()
#     # stop loop on close module
#     import atexit
#     atexit.register(MQTT.loop_stop)
#     return True


# def pull_connectors():
#     global MQTT
#     if MQTT is None:
#         return None
#     # get all devices connected by mqtt
#     mqtt_connectors = Connector.objects.filter(connector_type=CONNECTOR_MQTT_1)
#     devices = []
#     for con in mqtt_connectors:
#         devices += list(con.device_set.all())
#     print(devices)

#     # test
#     dev = devices[0]
#     tag = dev.tag_set.get(code='tag1')
#     publish_tag_request(MQTT, dev.connector, dev, tag)


# def app():
#     # connect and subscribe to broker
#     MQTT = MqttClient()
#     MQTT.subscribe('ci-cloud/#')
#     MQTT.loop_start()

#     # # test
#     # device = Device.objects.get(id=2)
#     # connector = device.connector
#     # tag = device.tag_set.first()
#     # publish_tag_request(MQTT, connector, device, tag)

#     # finish loop on close module
#     import atexit
#     atexit.register(MQTT.loop_stop)