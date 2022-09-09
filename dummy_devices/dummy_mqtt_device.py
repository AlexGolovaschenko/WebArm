import json
import struct
import time
import paho.mqtt.client as paho
from paho import mqtt
from paho.mqtt.subscribeoptions import SubscribeOptions


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
class RequestHandler:
    """
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
    def __init__(self, mqtt_client, device):
        self._mqtt = mqtt_client
        self._device = device
        self._mqtt.registry_callback('on_connect', self.print_on_connect)
        self._mqtt.registry_callback('on_publish', self.print_on_publish)
        self._mqtt.registry_callback('on_subscribe', self.print_on_subscribe)
        self._mqtt.registry_callback('on_message', self.print_on_message)
        self._mqtt.registry_callback('on_message', self.handle_request)

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

    def handle_request(self, client, userdata, msg):
        cloud, token, topic = msg.topic.split('/')
        if   topic == 'ping':    self._handle_ping_request(token, msg.payload)
        elif topic == 'com':     self._handle_com_request(token, msg.payload)
        elif topic == 'control': self._handle_control_request(token, msg.payload)
        else: print(f'invalide topic: {msg}')

    def _handle_ping_request(self, token, request):
        if request == 'ping':
            topic = TOPIC_TEMPLATE.format(token=token, topic='ping')
            self._mqtt.publish(topic, 'pong')
            pass
        else:
            # this is a wrong request
            print(f'Wrong ping request: {request}')

    def _handle_com_request(self, token, request):
        request = self._parse_payload(request)
        try:
            device_id = request['id']
            device_adr = request['adr']
            mb_function = request['f']
            first_register = request['r']
            regicters_count = request['n']
        except KeyError:
            print(f'Invalide request data: {request}')
            return
        topic = TOPIC_TEMPLATE.format(token=token, topic='com')
        response = {
            'id': device_id,
            's': 0,
            'r': first_register,
            'v': self._device.get_register_value(first_register),
        }
        self._mqtt.publish(topic, json.dumps(response))

    def _handle_control_request(self, token, request):
        # do nothing for now
        pass

    def _parse_payload(self, payload):
        try:
            return json.loads(payload)
        except json.decoder.JSONDecodeError:
            print(f'MQTT error: JSON decode error')
            return {}


#-----------------------------------------------------------
class DummyDevice:
    _registers = {
        256: [16756, 52429],    # =15.3
        258: [25],
        259: [50],
        300: [1245],
        301: [52313],
    }

    def __init__(self):
        pass

    def get_register_value(self, reg):
        return self._registers.get(reg, [0])



#-----------------------------------------------------------
if __name__ == "__main__":
    mqtt = MqttClient()
    device = DummyDevice()
    handler = RequestHandler(mqtt, device)
    handler.subscribe('ci-cloud/#')

    while True:
        time.sleep(1)