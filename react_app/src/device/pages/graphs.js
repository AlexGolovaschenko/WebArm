import React from 'react' 
import {useParams} from 'react-router-dom'

import DeviceHeader from '../components/DeviceHeader'
import RenderWidgets from '../../Widgets/renderWidgets'



const WidgetsTemplate = {
  widgets:[   
    {
      type: 'graph',
      width: 4,
      height: 'calc(65vh)',  // TODO: graph legeng heght can be seted correct just when 'height' property seted in px  (with calc(65vh) it doesn't work)
      title: 'История',
      tags: null,
      legend: true,
      toolbar: true,
    }      
  ]
}



export default function DeviceOverviewPage(props) {
  const { device_id } = useParams();
  
  // render the page
  return (
    <React.Fragment>
      <DeviceHeader device_id={device_id}/>
      <RenderWidgets widgetsTemplate={WidgetsTemplate} device_id={device_id}/>
    </React.Fragment>
  );
}

