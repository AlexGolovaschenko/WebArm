# ------------------------------------------------------------
DATA_TYPE_INT = 'INT'
DATA_TYPE_FLOAT = 'FLOAT'
DATA_TYPE_STRING = 'STRING'
DATA_TYPE_BOOL = 'BOOL'

SUPPORTED_DATA_TYPES = [
    (DATA_TYPE_INT,     'INT'), 
    (DATA_TYPE_FLOAT,   'FLOAT'), 
    (DATA_TYPE_STRING,  'STRING'), 
    (DATA_TYPE_BOOL,    'BOOL'),    
]

# ------------------------------------------------------------
# tag values
TAG_VALUE_QUALITY_GOOD = 'GOOD'
TAG_VALUE_QUALITY_BAD = 'BAD'
TAG_VALUE_QUALITY = [
    (TAG_VALUE_QUALITY_GOOD, 'GOOD'), 
    (TAG_VALUE_QUALITY_BAD, 'BAD')
]


# ------------------------------------------------------------
MODBUS_READ_FUNCTIONS = [
    ('1', '1 (0x01) - Read Coil'),
    ('2', '2 (0x02) - Read Discrete Input'),   
    ('3', '3 (0x03) - Read Holding Registers'),    
    ('4', '4 (0x04) - Read Input Registers'),  
]

MODBUS_WRITE_FUNCTIONS = [
    ('5',  '5 (0x05) - Write Single Coil'),
    ('6',  '6 (0x06) - Write Single Holding Register'),
    ('15', '15 (0x0F) - Write Multiple Coils'),
    ('16', '16 (0x10) - Write Multiple Holding Registers'),
]

