import json
from owencloud_connector import OwenCloudConnector, printJson



if __name__ == '__main__':
    # -----------------------------------------------------------
    # load local settings
    with open('./local_settings.json', 'r', encoding='utf-8') as f:
        local = json.loads(f.read())

    # -----------------------------------------------------------
    # login to cloud
    token = local.get('MY_TOKEN', None)
    user_domain = local.get('DOMAIN', 'RU')
    connector = OwenCloudConnector(debug = False, token = token, user_domain=user_domain)
    if not token:
        connector.login(local['MY_LOGIN'], local['MY_PASS'])

    # -----------------------------------------------------------
    # read devices list
    devices_list = connector.getDevicesList()

    # -----------------------------------------------------------
    # read device 
    tags_id = []
    for device in devices_list:
        id = device['id']
        device_data = connector.getDeviceConfiguration(id)
        # printJson(device_data)

        parameters = device_data['parameters']
        for p in parameters:
            tags_id.append(p['id'])


        tags_data = connector.getReadTagsLastData(tags_id)
        printJson(tags_data)