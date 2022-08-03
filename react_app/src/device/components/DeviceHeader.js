import React, { useEffect } from 'react' 

import axiosInstance from "../../backendAPI/axiosClient";
import getBaseUrl from '../../backendAPI/localSettings'
const BASE_URL = getBaseUrl()



export default function DeviceHeader(props) {
  const [deviceData, setDeviceData] = React.useState({})
  const device_id = props.device_id;

  function readDeviceParameters() {
    axiosInstance.get(BASE_URL + "/device/parameters/", { params: { id: device_id }} )
      .then(responce => { 
        responce && setDeviceData({...responce.data}) 
      }) 
  }
  
  useEffect(() => {
    readDeviceParameters();
    const deviceParametersUpdateInterval = setInterval(readDeviceParameters, 5000);
    return () => {
      clearInterval(deviceParametersUpdateInterval);
    };
  }, [])

  
  // render the page
  return (
    <React.Fragment>
      <div className='d-flex border rounded desk-border-secondary px-3 mb-1 mx-1'>
        <h3 className='pt-1'>Устройство: <b>{deviceData.name}</b></h3>
        <div className='ml-auto mx-3 px-3 border-x desk-border-secondary'>
          { deviceData.is_online ? 
            <div className='text-success'>
              <span>Онлайн</span> <br/>
              <i className='fas fa-check text-center w-100'></i>
            </div>
          : <div className='text-danger'>
              <span>Нет связи</span> <br/>
              <i className='fas fa-times text-center w-100'></i>
            </div>
          }
        </div>
        <div>
          <p className='m-0 mr-1 text-right'>Данные обновлены: <br/> {deviceData.verbose_last_update}</p>
        </div>
      </div>
    </React.Fragment>
  );
}

