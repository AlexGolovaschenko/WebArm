import React from 'react' 

import DeviceHeader from '../components/DeviceHeader'
import RenderWidgets from '../../Widgets/renderWidgets'



const WidgetsTemplate = {
  widgets:[   
    {
      type: 'graph',
      width: 4,
      height: 'calc(65vh)',
      title: 'История',
      tags: null,
      legend: true,
      toolbar: true,
    }      
  ]
}



export default function DeviceOverviewPage(props) {
  const device_id = props.device_id;
  
  // render the page
  return (
    <React.Fragment>
      <DeviceHeader device_id={device_id}/>
      <RenderWidgets widgetsTemplate={WidgetsTemplate} device_id={device_id}/>
    </React.Fragment>
  );
}

