import axiosInstance from "./axiosApi";
import getBaseUrl from './localSettings';

// ---------------------------------------------------------------------------------
// access to company parameters
export function getCompanyParameters(cb_success) {
  const params = {};
  const endpoint = "/company/info/";
  backendApiRequest(GET, endpoint, null, params, cb_success);
}
export function postCompanyParameters(parameters, cb_success, cb_error) {
  const params = {};
  const body = {...parameters};
  const endpoint = "/company/info/";
  backendApiRequest(POST, endpoint, body, params, cb_success, cb_error);
}


// ---------------------------------------------------------------------------------
// access to device configuration parameters
export function getDeviceParameters(device_id, cb_success) {
  const params = { id: device_id };
  const endpoint = "/device/parameters/";
  backendApiRequest(GET, endpoint, null, params, cb_success ); 
}
export function postDeviceParameters(device_id, device_parameters, cb_success, cb_error) {
  const params = { id: device_id };
  const body = {...device_parameters}; 
  const endpoint = "/device/parameters/";
  backendApiRequest(POST, endpoint, body, params, cb_success, cb_error ); 
}

// access to device modbus parameters
export function getDeviceModbusParameters(device_id, cb_success) {
  const params = { id: device_id };
  const endpoint = "/device/modbus/parameters/";
  backendApiRequest(GET, endpoint, null, params, cb_success ); 
}
export function postDeviceModbusParameters(device_id, device_parameters, cb_success, cb_error) {
  const params = { id: device_id };
  const body = {...device_parameters};
  const endpoint = "/device/modbus/parameters/";
  backendApiRequest(POST, endpoint, body, params, cb_success, cb_error );  
}

// access to device tags parameters
export function getDeviceTagsParameters(device_id, tags_list, cb_success) {
  const params = { id: device_id, tags: tags_list };
  const endpoint = "/device/tags/parameters/";
  backendApiRequest(GET, endpoint, null, params, cb_success );
}
export function postDeviceTagsParameters(device_id, tags_parameters, cb_success, cb_error) {
  const params = { id: device_id };
  const body = tags_parameters;
  const endpoint = "/device/tags/parameters/";
  backendApiRequest(POST, endpoint, body, params, cb_success, cb_error );
}
export function deleteDeviceTags(device_id, tags_list, cb_success) {
  const params = { id: device_id, tags: tags_list };
  const endpoint = "/device/tags/parameters/";
  backendApiRequest(DELETE, endpoint, null, params, cb_success );
}


// ---------------------------------------------------------------------------------
// access to events parameters
export function getEventsConfig(device_id, events_list, cb_success) {
  const params = { id: device_id, events_id: events_list };
  const endpoint = "/events/config/";
  backendApiRequest(GET, endpoint, null, params, cb_success );
}
export function postEventsConfig(device_id, events_parameters, cb_success, cb_error) {
  const params = { id: device_id };
  const body = events_parameters;
  const endpoint = "/events/config/";
  backendApiRequest(POST, endpoint, body, params, cb_success, cb_error );
}
export function deleteEvents(device_id, events_list, cb_success) {
  const params = { id: device_id, events_id: events_list };
  const endpoint = "/events/config/";
  backendApiRequest(DELETE, endpoint, null, params, cb_success );
}





// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// commot backend requests
const GET     = 'GET';
const POST    = 'POST';
const DELETE  = 'DELETE';

async function backendApiRequest(method, endpoint, body, params, cb_success, cb_error=null) {
  let response = null;
  const BASE_URL = getBaseUrl();

  switch (method) {
    case GET:
      response = await axiosInstance.get(BASE_URL + endpoint, { params: params } );
      response && cb_success(response.data);
      break;

    case POST:
      try { 
        response = await axiosInstance.post(BASE_URL + endpoint, body, { params: params } );
        response && cb_success(response.data);
      } catch (error) {
        error.response && cb_error && cb_error(error.response.data);
      }
      break;

    case DELETE:
      response = await axiosInstance.delete(BASE_URL + endpoint, { params: params } );
      response && cb_success(response.data);
      break;

    default:
      throw new Error(`Api method ${method} not supported.`);
  }
}