import React from 'react' 
import {useParams} from 'react-router-dom'

import DeviceHeader from '../components/DeviceHeader'
import RenderWidgets from '../../Widgets/renderWidgets'



export default function DeviceOverviewPage(props) {
  const { device_id } = useParams();
  const widgetsTemplate = props.widgetsTemplate;
  
  // render the page
  return (
    <React.Fragment>
      <DeviceHeader device_id={device_id}/>
      <RenderWidgets widgetsTemplate={widgetsTemplate} device_id={device_id}/>
    </React.Fragment>
  );
}

