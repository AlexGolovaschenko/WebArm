DEFAULT_WIDGETS_TEMPLATE = {
    "widgets":[
      {
        "type": "table",
        "width": 4,
        "title": "Таблица параметров устройства",
        "tags": [],   
        "fields": ["#No", "code", "name", "value"]              
      },    
      {
        "type": "graph",
        "width": 4,
        "title": "Графики параметров устройства",
        "tags": [],
        "legend": True,
        "toolbar": True,
      }      
    ]
  }


def get_default_template():
  return DEFAULT_WIDGETS_TEMPLATE