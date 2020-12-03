import React, { useEffect } from 'react' 

import Loader from '../../components/BaseParts/Loader'
import RenderWidgets from '../../components/Widgets/renderWidgets'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()



const WidgetsTemplate = {
  widgets:[
    {
      type: 'table',
      size: 2,
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
      fields: ['#No', 'code', 'name', 'value']              
    },
    {
      type: 'table',
      size: 2,
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
      fields: ['#No', 'code', 'name', 'value']              
    },    
    {
      type: 'graph',
      size: 2,
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],
      legend: true,
      history: 'last data',
      last: '12h',
      resolution: '10m'
    },    
    {
      type: 'graph',
      size: 2,
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],
      legend: false,
      history: 'last data',
      last: '12h',
      resolution: '10m'
    }      
  ]
}



export default function DeviceOverviewPage(props) {
  const [deviceName, setDeviceName] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const device_id = props.device_id;

  function readDeviceParameters() {
    axiosInstance.get(BASE_URL + "/device/parameters/", { params: { id: device_id }} )
      .then(responce => responce.data)
      .then(deviceParameters => { setDeviceName(deviceParameters.name) }) 
  }
  
  useEffect(() => {
    readDeviceParameters();
    setTimeout( () => { setLoading(false) }, 1000);
  }, [])

  
  // render the page
  return (
    <React.Fragment>
        <h3 className='pb-2'>Устройство: <b>{deviceName}</b></h3>
        {loading ? <Loader /> : < RenderWidgets widgets_template={WidgetsTemplate} device_id={device_id}/> }
    </React.Fragment>
  );
}

