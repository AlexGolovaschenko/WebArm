import React from 'react' 
import {useParams} from 'react-router-dom'

import DeviceHeader from '../components/DeviceHeader'
import RenderWidgets from '../../Widgets/renderWidgets'



const WidgetsTemplate = {
  widgets:[   
    {
      type: 'eventslog',
      width: 4,
      title: 'Журнал событий',
      category_selection_panel: true
    }      
  ]
}



export default function DeviceEventsLogPage(props) {
  const { device_id } = useParams();
  
  // render the page
  return (
    <React.Fragment>
      <DeviceHeader device_id={device_id}/>
      <RenderWidgets widgetsTemplate={WidgetsTemplate} device_id={device_id}/>
    </React.Fragment>
  );
}

 