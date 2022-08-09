DEVICE_PROTOCOL_MODBUS_RTU = 'MODBUS-RTU'
DEVICE_PROTOCOL_MODBUS_ASCII = 'MODBUS-ASCII'
DEVICE_PROTOCOL_MODBUS_TCP = 'MODBUS-TCP'

DEVICE_PROTOCOL_TYPE = [
    (DEVICE_PROTOCOL_MODBUS_RTU,     'MODBUS-RTU'), 
    (DEVICE_PROTOCOL_MODBUS_ASCII,   'MODBUS-ASCII'), 
    (DEVICE_PROTOCOL_MODBUS_TCP,     'MODBUS-TCP'),
]

# ------------------------------------------------------------
# modbus parameters
MODBUS_PROTOCOL_TYPE = [
    ('RTU',     'MODBUS-RTU'), 
    ('ASCII',   'MODBUS-ASCII'), 
    ('TCP',     'MODBUS-TCP'),
]

MODBUS_DATA_TYPES = [
    ('WORD',    'WORD'), 
    ('INT',     'INT'), 
    ('UINT',    'UINT'), 
    ('FLOAT',   'FLOAT'), 
    ('STRING',  'STRING'), 
    ('BOOL',    'BOOL'), 
]

MODBUS_BAUDRATE = [
    (300,   '300'), 
    (600,   '600'),  
    (1200,  '1200'), 
    (2400,  '2400'), 
    (4800,  '4800'), 
    (9600,  '9600'),  
    (14400, '14400'),  
    (19200, '19200'),  
    (28800, '28800'),  
    (38400, '38400'),  
    (57600, '57600'),  
    (115200,'115200'), 
]

MODBUS_PARITY = [
    ('none',    'none'), 
    ('odd',     'odd'), 
    ('even',    'even'),
]

MODBUS_ADDRESS_SIZE = [ 
    ('8', '8') 
]

MODBUS_STOP_BIT = [
    ('1', '1'), 
    ('2', '2')
]

