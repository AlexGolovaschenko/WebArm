import axiosInstance from "./axiosApi";
import getBaseUrl from './localSettings'


const BASE_URL = getBaseUrl()


// ---------------------------------------------------------------------------------
// access to device configuration parameters
export async function getDeviceParameters(device_id, cb) {
  const params = { id: device_id }
  const responce = await axiosInstance.get(BASE_URL + "/device/parameters/", { params: params } )
  responce && cb(responce.data)
}
export async function postDeviceParameters(device_id, device_parameters, cb) {
  const params = { id: device_id }
  const body = {...device_parameters} 
  const responce = await axiosInstance.post(BASE_URL + "/device/parameters/", body, { params: params } )
  responce && cb(responce.data)
}

// access to device modbus parameters
export async function getDeviceModbusParameters(device_id, cb) {
  const params = { id: device_id }
  const responce = await axiosInstance.get(BASE_URL + "/device/modbus/parameters/", { params: params } )
  responce && cb(responce.data)
}
export async function postDeviceModbusParameters(device_id, device_parameters, cb) {
  const params = { id: device_id }
  const body = {...device_parameters} 
  const responce = await axiosInstance.post(BASE_URL + "/device/modbus/parameters/", body, { params: params } )
  responce && cb(responce.data)
}

// access to device tags parameters
export async function getDeviceTagsParameters(device_id, tags_list, cb) {
  const params = { id: device_id, tags: tags_list }
  const responce = await axiosInstance.get(BASE_URL + "/device/tags/parameters/", { params: params } )
  responce && cb(responce.data)
}
export async function postDeviceTagsParameters(device_id, tags_parameters, cb_success, cb_error) {
  const params = { id: device_id }
  const body = tags_parameters
  try { 
    const responce = await axiosInstance.post(BASE_URL + "/device/tags/parameters/", body, { params: params } )
    responce && cb_success(responce.data)
  } catch (error) {
    error.response && cb_error(error.response.data)
    console.log(error.response); // TODO: delete this log
  }
}
export async function deleteDeviceTags(device_id, tags_list, cb) {
  const params = { id: device_id, tags: tags_list }
  const responce = await axiosInstance.delete(BASE_URL + "/device/tags/parameters/", { params: params } )
  responce && cb(responce.data)
}