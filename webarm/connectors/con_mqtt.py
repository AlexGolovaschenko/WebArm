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
        id  - request id (should be returned in the response)
        adr - device address
        f   - modbus function (string)
        r   - first register (should be returned in the response)
        n   - count of registers

    */com  response example (JSON):   
    {"id":12566, "s":0, "r":25, "v":[0, 255, 761, 15]}
    where:
        id  - request id
        s   - status code (0 - OK, other - error code)
        r   - first register
        v   - list of registers values


# use example
def app():
    mqtt = PullHandler()
    handler = PullHandler(mqtt)
    while True:
        handler.make_requests()
"""
#-------------------------------------------------------------------------------
import json
import struct
import paho.mqtt.client as paho
from paho import mqtt
from paho.mqtt.subscribeoptions import SubscribeOptions

from django.utils import timezone

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
            raise Exception(f'Callback registaration error. Wrong event name: {event}')
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
        # Collect list of connectors with theirs devices for pulling
        mqtt_connectors = Connector.objects.filter(connector_type=CONNECTOR_MQTT_1)
        for con in mqtt_connectors:
            self._pull_queue[con.id] = {
                'weating_for_response':False, 
                'devices':{dev.id: DeviceCom(con, dev) for dev in con.device_set.all()}
                }

    def next(self, many=False):
        # Return next device for pulling (or list of devices if many=True)
        items = []
        for con_id, con_props in self._pull_queue.items():
            # skip if connector is weating for responce from device
            if self._pull_queue[con_id]['weating_for_response']:
                continue
            next_device = self._find_next_device(con_id, con_props)
            if next_device:
                if many:
                    items.append(next_device)
                else:
                    items = next_device
                    break
        return items if items else None

    def pass_com_response(self, con_id, response):
        dev_id = response.get('id', None)
        if dev_id is None:
            return
        self._pull_queue[con_id]['devices'][dev_id].handle_responce(response)

    def set_connector_busy(self, con_id):
        self._pull_queue[con_id]['weating_for_response'] = True

    def reset_connector_busy(self, con_id):
        self._pull_queue[con_id]['weating_for_response'] = False

    def _find_next_device(self, con_id, con_props):
        # return the next device from queue for pulling
        for dev_id, dev in con_props['devices'].items():
            if dev.done:
                continue
            return dev
        else:
            # all devices was pulled
            return None


#-------------------------------------------------------------------------------
class DeviceCom:
    def __init__(self, connector, device):
        if connector is not device.connector:
            raise Exception('Given device is not belongs to given connector')
        self.connector_id = device.id
        self.device_id = device.id
        self._tags_done = {}
        self._refresh_tags_list(self.device.tag_set.all())

    @property
    def device(self):
        # here is fix access to DB (if i store the device object on init, it hasn't 
        # access to DB data, just local copy of DB data)
        return Device.objects.get(pk=self.device_id)

    @property
    def connector(self):
        # here is fix access to DB (if i store the connector object on init, it hasn't 
        # access to DB data, just local copy of DB data)
        return Connector.objects.get(pk=self.connector_id)

    @property
    def done(self):
        for t, v in self._tags_done.items():
            if not v: return False
        # check device polling period after reading all tags
        need_update = self._is_need_update()
        if need_update:
            self._reset_all_done_tags()
            return False
        else:
            return True 

    def create_read_request(self, tag=None):
        """ Reques example (JSON): {"id":12566, "f":16, "adr":16, "r":25, "n":4}
            Tag object can be passed for read a singl tag.
        """
        # Select tags to read. 
        # For groupe reading will be selected tags with tha same mb function.
        if tag is None:
            tags_list = self._select_tags_for_reading()
        else:
            tags_list = [tag]
        if tags_list is None:
            return None

        # create request payload
        payload = {
            'id': self.device_id,
            'adr': self._get_modbus_address(),
            'r': tags_list[0].modbustagparameters.register_address,
            'f': tags_list[0].modbustagparameters.read_function,
            'n': self._count_request_data_size(tags_list),
        }
        try:
            return json.dumps(payload)
        except:
            print(f'MQTT error: Error on dump request data to JSON')
            return None

    def create_write_request(self, tag, value):
        # TODO: for now supported only tags reading
        # mb_function = tag.modbustagparameters.write_function
        raise Exception('Write tags is not supported yet')

    def handle_responce(self, response):
        # response example (JSON): {"id":12566, "s":0, "r":25, "v":[0, 255, 761, 15]}
        # update connection timestamp
        self.device.refresh()
        self.connector.refresh()

        # check device id
        if self.device.id != response.get('id', None): 
            print(f'Error: Device id is not equal to responce data')
            return None

        # get tags by register address and device
        tag = self._fined_tag_by_register_adr(response.get('r', None))
        if not tag: 
            return None

        # convert received value to tag data type
        values = response.get('v', None)
        swap = self._check_need_to_swap_registers(self.device)
        tag_value = self._convert_registars_list_to_tag_value(
            values, tag.data_type, swap=swap)
        if not values: 
            return None

        # tag data quality
        connection_status = response.get('s', None)
        if connection_status is None:
            print(f'Warning: Device connection status is not provided')
            quality = TAG_VALUE_QUALITY_GOOD
        elif connection_status == 0:
            quality = TAG_VALUE_QUALITY_GOOD
        else:
            quality = TAG_VALUE_QUALITY_BAD

        # modify tag value
        update_tag_value(tag, tag_value, quality)
        print(tag_value)

    def _is_need_update(self):
        # return True if it's time to update device tags
        period = timezone.timedelta(seconds=self.device.polling_period)
        if self.device.last_update <= (timezone.now()-period):
            return True
        return False

    def _reset_all_done_tags(self):
        for t in self._tags_done:
            self._tags_done[t] = False

    def _select_tags_for_reading(self):
        # return the next tag from queue for pulling
        # TODO: make groupe requests
        tags = self.device.tag_set.all()
        self._refresh_tags_list(tags)
        for tag in tags:
            if not self._tags_done.get(tag.id, False):
                break
        else:
            return None
        self._tags_done[tag.id] = True
        return [tag]

    def _refresh_tags_list(self, tags):
        new_list = {tag.id: self._tags_done.get(tag.id, False) for tag in tags}
        self._tags_done = new_list

    def _count_request_data_size(self, tags_list):
        size = 0
        for t in tags_list:
            size += self._get_tag_register_size(t)
        return size

    def _get_tag_register_size(self, tag):
        if tag.data_type == DATA_TYPE_INT: return 1
        elif tag.data_type == DATA_TYPE_FLOAT: return 2
        elif tag.data_type == DATA_TYPE_STRING: return 1
        elif tag.data_type == DATA_TYPE_BOOL: return 1
        else: 
            raise Exception(f'Tag datatype "{tag_datatype}" is not supported')

    def _get_modbus_address(self):
        protocol = self.device.protocol_type
        if protocol == DEVICE_PROTOCOL_MODBUS_RTU:
            return self.device.protocol_mb_rtu.device_address
        elif protocol == DEVICE_PROTOCOL_MODBUS_ASCII:
            return self.device.protocol_mb_ascii.device_address
        elif protocol == DEVICE_PROTOCOL_MODBUS_TCP:
            return self.device.protocol_mb_tcp.device_ip

    def _fined_tag_by_register_adr(self, register_adr):
        if not register_adr: 
            print(f'MQTT error: Tag.get - Register address not provided')
            return None
        try:
            tag = Tag.objects.get(device__id=self.device_id, 
                modbustagparameters__register_address=register_adr)
            return tag
        except Tag.DoesNotExist:
            print(f'MQTT error: Tag.get - Object does not exist')
            return None
        except Tag.MultipleObjectsReturned:
            print(f'MQTT error: Tag.get - Multiple objects returned')
            return None        

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
class PullHandler:
    def __init__(self, mqtt_client):
        self._mqtt = mqtt_client
        self._queue = PullQueue()
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
        rq_list = self.get_requests_list()
        for rq in rq_list:
            self._pull_connector(*rq)

    def get_requests_list(self):
        rq_list = []
        com_list = self._queue.next(many=True)
        if com_list is None:
            print('Queue is empty OR all connectors are busy')
            return rq_list
        for com in com_list:
            if request := com.create_read_request():
                topic = TOPIC_TEMPLATE.format(token=com.connector.token, topic='com')
                rq_list.append((com.connector_id, topic, request))
        return rq_list

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

    def _pull_connector(self, connector_id, topic, request):
        if request is not None:
            self._mqtt.publish(topic, request)
            self._queue.set_connector_busy(connector_id)  

    def _handle_com_response(self, connector, response):
        response = self._parse_payload(response)
        self._queue.reset_connector_busy(connector.id)
        self._queue.pass_com_response(connector.id, response)

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


