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

from django.db.models import Q

from .models import Connector
from .utils import update_tag_value
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

class MqttClient:
    def __init__(self):
        print('start MQTT connection')
        self.client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
        self.client.on_connect = self.on_connect
        self.client.on_subscribe = self.on_subscribe
        self.client.on_message = self.on_message
        self.client.on_publish = self.on_publish
        self.client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS) # enable TLS for secure connection
        self.client.username_pw_set(CLIENT_NAME, CLIENT_PASSWORD)
        self.client.connect(BROKER_URL, BROKER_PORT)

    def publish(self, topic, value):
        # publish value for topics
        self.client.publish(topic, value, qos=1)

    def subscribe(self, topic):
        # subscribe for the topic
        # "example/#" - you can subscribe to all topics of "example/" by using the wildcard "#"
        self.client.subscribe(topic, qos=1)

    def on_connect(self, client, userdata, flags, rc, properties=None):
        # execute when connection with broker established
        print("MQTT CONNACK received with code %s." % rc)

    def on_publish(self, client, userdata, mid, properties=None):
        # execute when client published a message
        print("MQTT published: mid-" + str(mid))

    def on_subscribe(self, client, userdata, mid, granted_qos, properties=None):
        # execute when client subscribe for topic
        print("MQTT subscribed: " + str(mid) + " " + str(granted_qos))

    def on_message(self, client, userdata, msg):
        # execute when client get message from broker
        print("MQTT received:" + msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
        handle_response(msg)

    def loop_start(self):
        self.client.loop_start()

    def loop_stop(self):
        print('close MQTT connection')
        self.client.loop_stop()


#-------------------------------------------------------------------------------
TOPIC_TEMPLATE = 'ci-cloud/{token}/{topic}'

def ping_connection(mqtt, connector):
    token = _get_connector_token(connector)
    topic = TOPIC_TEMPLATE.format(token=token, topic='ping')
    request = 'ping'
    mqtt.publish(topic, request)

def publish_tag_request(mqtt, connector, device, tag):
    token = _get_connector_token(connector)
    topic = TOPIC_TEMPLATE.format(token=token, topic='com')
    request = _create_com_request(device, tag)
    mqtt.publish(topic, request)

def handle_response(response):
    cloud, token, topic = response.topic.split('/')
    if   topic == 'ping':    _handle_ping_response(token, response.payload)
    elif topic == 'com':     _handle_com_response(token, response.payload)
    elif topic == 'control': _handle_control_response(token, response.payload)
    else: print(f'invalide topic: {response}')


def _handle_ping_response(token, response):
    connector = _fined_connector_by_token(token)
    if not connector: 
        return None
    connector.refresh()
    if response.payload == 'pong':
        # this is correct answer
        pass
    else:
        # this is wrong answer
        pass

def _create_com_request(device, tag, value=None):
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
        'adr': _get_device_modbus_address(tag.device),
        'r': tag.modbustagparameters.register_address,
        'f': mb_function,
        'n': _get_tag_register_size(tag),
    }
    try:
        return json.dumps(payload)
    except:
        print(f'MQTT error: Error on dump request data to JSON')
        return None

def _handle_com_response(token, response):
    # response example (JSON): {"id":12566, "s":0, "r":25, "v":[0, 255, 761, 15]}
    # get connector by token
    connector = _fined_connector_by_token(token)
    if not connector: return None
    connector.refresh()

    # get device by modbus address and connector
    payload = _parse_payload(response)
    device = _fined_device_by_id(connector, payload.get('id', None))
    if not device: return None

    # get tags by register address and device
    tag = _fined_tag_by_register_adr(device, payload.get('r', None))
    if not tag: return None
    
    # convert received value to tag data type
    values = payload.get('v', None)
    swap = _check_need_to_swap_registers(device)
    tag_value = _convert_registars_list_to_tag_value(values, tag.data_type, swap=swap)
    if not values: return None

    # quality
    connection_status = payload.get('s', None)
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

def _handle_control_response(token, response):
    # do nothing for now
    pass


#-------------------------------------------------------------------------------
def _get_connector_token(connector):
    return connector.token

def _fined_connector_by_token(token):
    try:
        connector = Connector.objects.get(token=token)
    except Connector.DoesNotExist:
        print(f'MQTT error: Connector with token {token} does not exists')
        connector = None
    return connector

def _fined_device_by_id(connector, device_id):
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

def _get_device_modbus_address(device):
    if device.protocol_type == DEVICE_PROTOCOL_MODBUS_RTU:
        return device.protocol_mb_rtu.device_address
    elif device.protocol_type == DEVICE_PROTOCOL_MODBUS_ASCII:
        return device.protocol_mb_ascii.device_address
    elif device.protocol_type == DEVICE_PROTOCOL_MODBUS_TCP:
        return device.protocol_mb_tcp.device_ip    

def _fined_tag_by_register_adr(device, register_adr):
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

def _get_tag_register_size(tag):
    if tag.data_type == DATA_TYPE_INT: return 1
    elif tag.data_type == DATA_TYPE_FLOAT: return 2
    elif tag.data_type == DATA_TYPE_STRING: return 1
    elif tag.data_type == DATA_TYPE_BOOL: return 1
    else: 
        raise Exception(f'Tag datatype "{tag_datatype}" is not supported')

def _convert_registars_list_to_tag_value(regs_list, tag_datatype, swap=True):
    if not isinstance(regs_list, list): 
        print(f'MQTT error: Registers values is not a list: {regs_list}')
        return None
    if tag_datatype == DATA_TYPE_INT: 
        return int(regs_list[0])
    elif tag_datatype == DATA_TYPE_FLOAT: 
        return _convert_registers_to_float(regs_list[:2], swap=swap)
    elif tag_datatype == DATA_TYPE_STRING: 
        return str(regs_list[0])
    elif tag_datatype == DATA_TYPE_BOOL: 
        return regs_list[0] > 0
    else: 
        raise Exception(f'Tag datatype "{tag_datatype}" is not supported')

def _convert_registers_to_float(registers, swap=True):
    a, b = (registers[1], registers[0]) if swap else (registers[0], registers[1])
    try:
        return struct.unpack('>f', bytes.fromhex(f"{a:0>4x}" + f"{b:0>4x}"))[0]
    except:
        print(f'MQTT error: Error on try to convert registers to float')
        return None

def _check_need_to_swap_registers(device):
    if device.protocol_type == DEVICE_PROTOCOL_MODBUS_RTU:
        return device.protocol_mb_rtu.lower_register_forward
    elif device.protocol_type == DEVICE_PROTOCOL_MODBUS_ASCII:
        return device.protocol_mb_ascii.lower_register_forward
    elif device.protocol_type == DEVICE_PROTOCOL_MODBUS_TCP:
        return device.protocol_mb_tcp.lower_register_forward    

def _parse_payload(payload):
    try:
        return json.loads(payload)
    except json.decoder.JSONDecodeError:
        print(f'MQTT error: JSON decode error')
        return {}


#-------------------------------------------------------------------------------
def app():
    # connect and subscribe to broker
    MQTT = MqttClient()
    MQTT.subscribe('ci-cloud/#')
    MQTT.loop_start()

    # # test
    # device = Device.objects.get(id=2)
    # connector = device.connector
    # tag = device.tag_set.first()
    # publish_tag_request(MQTT, connector, device, tag)

    # finish loop on close module
    import atexit
    atexit.register(MQTT.loop_stop)




