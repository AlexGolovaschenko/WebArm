# -*- coding: utf-8 -*-
import json, urllib3, certifi
import logging, pprint



def printJson(js):
    '''pretty print json data'''
    pprint.pprint(js)




class OwenCloudConnector():
    def __init__(self, **kwargs):
        self.debug = kwargs.get('debug', False)
        self.Http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where()) 
        self.API_URL = 'https://api.owencloud.ru/v1/'
        self.token = kwargs.get('token', 'None')

        if self.debug is True:
            logging.basicConfig()
            logging.getLogger("urllib3").setLevel(logging.DEBUG)
            requests_log = logging.getLogger("urllib3")
            requests_log.setLevel(logging.DEBUG)
            requests_log.propagate = True

      
    def login(self, user, password):
        ''' logining in cloud
        you must call it first, before use other methods
        or pass the token when init this class 
        WARNING! some time token from owencloud received is invalide 
                ( if user dont set constant token on cloud settings 
                or if user registred on cloud.ua )
                I recomend use constant token unstead login   
        '''
        url = self.API_URL + 'auth/open'
        data = {'login':user, 'password':password}
        self.token = 'None'
        try:
            js_dict = self._request('POST', url, data=data)    
        except:
            print('ERROR: Login request error')
            return 

        try:
            self.token = js_dict['token']
        except:
            print('ERROR: Token is not in responce')
            print(js_dict)
            return 

        print('SUCCESS: Login succes')


    def getDevicesList(self):
        ''' return list of devices for current user 
        '''
        url = self.API_URL + 'device/index'
        headers = {'Authorization': 'Bearer ' + self.token}
        js_dict = self._request('POST', url, headers)
        names = []
        for device in js_dict:
            names.append( '%s: %s' %(device['name'], device['id']) )
        print('SUCCESS: Devices List received: ' + str(names))
        return js_dict


    def getDeviceConfiguration(self, device_id):
        ''' return device data by device id
        '''
        url = self.API_URL + 'device/' + str(device_id)
        headers = {'Authorization': 'Bearer ' + self.token}
        js_dict = self._request('POST', url, headers)
        print('SUCCESS: Device "id={}" data received'.format(device_id))        
        return js_dict


    def getReadTagsLastData(self, tags_ids):
        ''' return lasts data of tags
        tags select by id, you shold pass to the function list of ids of target tags
        '''
        url = self.API_URL + 'parameters/last-data'
        headers = {'Authorization': 'Bearer ' + self.token}
        data = {"ids": tags_ids}
        js_dict = self._request('POST', url, headers, data=data)
        print('SUCCESS: Tags last data received')        
        return js_dict


    def _request(self, verb, url, headers={}, **kwargs):
        ''' make request to cloud API 
        return parsed dict from response json
        '''
        data = kwargs.get('data', None)
        body = bytes()
        if data is not None:
            body = json.dumps(data).encode('utf-8')
            headers.update({'Content-Type': 'application/x-www-form-urlencoded'})
        try:
            r = self.Http.request(verb, url, headers=headers, body=body)
            js_dict = json.loads(r.data.decode('utf-8'))
        except:
            print('ERROR: Request error')
            raise

        if self.debug is True:     
            self._print_request(r)
        return js_dict       


    def _print_request(self, r):
        '''print request parameters'''
        print('status: ' + str(r.status))
        print('token is: ' + str(self.token))
        print('data: ')
        printJson(json.loads(r.data))
        print('\n')

