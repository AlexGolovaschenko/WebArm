import React, { useEffect } from 'react' 

import Loader from '../../components/BaseParts/Loader'
import DeviceHeader from '../../components/BaseParts/DeviceHeader'
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
      toolbar: true,
      history: 'last data',
      last: '12h',
      resolution: '10m'
    },    
    {
      type: 'graph',
      size: 2,
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],
      legend: false,
      toolbar: true,
      history: 'last data',
      last: '12h',
      resolution: '10m'
    }      
  ]
}



export default function DeviceOverviewPage(props) {
  const device_id = props.device_id;
  
  // render the page
  return (
    <React.Fragment>
      <DeviceHeader device_id={device_id}/>
      < RenderWidgets widgets_template={WidgetsTemplate} device_id={device_id}/>
    </React.Fragment>
  );
}

