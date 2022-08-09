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
    ('1', '1 - Read Coil'),
    ('2', '2 - Read Discrete Input'),   
    ('3', '3 - Read Holding Registers'),    
    ('4', '4 - Read Input Registers'),  
]

MODBUS_WRITE_FUNCTIONS = [
    ('5',  '5 - Write Single Coil'),
    ('6',  '6 - Write Single Holding Register'),
    ('15', '15 - Write Multiple Coils'),
    ('16', '16 - Write Multiple Holding Registers'),
]

