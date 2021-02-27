
WEBARM_DATA_TYPE_INT = 'INT'
WEBARM_DATA_TYPE_FLOAT = 'FLOAT'
WEBARM_DATA_TYPE_STRING = 'STRING'
WEBARM_DATA_TYPE_BOOL = 'BOOL'

WEBARM_SUPPORTED_DATA_TYPES = [
    (WEBARM_DATA_TYPE_INT,     'INT'), 
    (WEBARM_DATA_TYPE_FLOAT,   'FLOAT'), 
    (WEBARM_DATA_TYPE_STRING,  'STRING'), 
    (WEBARM_DATA_TYPE_BOOL,    'BOOL'),    
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


# ------------------------------------------------------------
# read functions
MODBUS_READ_FUNCTIONS = [
    ('1', '1 - Read Coil'),
    ('2', '2 - Read Discrete Input'),   
    ('3', '3 - Read Holding Registers'),    
    ('4', '4 - Read Input Registers'),  
]

MODBUS_WRITE_FUNCTIONS = [
    ('5', '5 - Write Single Coil'),
    ('6', '6 - Write Single Holding Register'),
    ('15', '15 - Write Multiple Coils'),
    ('16', '16 - Write Multiple Holding Registers'),
]


# ------------------------------------------------------------
# tag values
TAG_VALUE_QUALITY_GOOD = 'GOOD'
TAG_VALUE_QUALITY_BAD = 'BAD'
TAG_VALUE_QUALITY = [
    (TAG_VALUE_QUALITY_GOOD, 'GOOD'), 
    (TAG_VALUE_QUALITY_BAD, 'BAD')
]
