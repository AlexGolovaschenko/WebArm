import React from 'react' 

import DeviceHeader from '../../components/BaseParts/DeviceHeader'
import RenderWidgets from '../../components/Widgets/renderWidgets'



export default function DeviceOverviewPage(props) {
  const device_id = props.device_id;
  const widgetsTemplate = props.widgetsTemplate;
  
  // render the page
  return (
    <React.Fragment>
      <DeviceHeader device_id={device_id}/>
      <RenderWidgets widgetsTemplate={widgetsTemplate} device_id={device_id}/>
    </React.Fragment>
  );
}

