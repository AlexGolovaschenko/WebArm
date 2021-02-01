// import React from 'react' 


// export default function DeviceEventsLogPage() {

//   return (
//     <React.Fragment>
//         <h3>Журнал событий обьекта</h3>
//         <p>Раздел находиться в разработке ... </p>
//     </React.Fragment>
//   );
// }

import React from 'react' 

import DeviceHeader from '../components/DeviceHeader'
import RenderWidgets from '../../Widgets/renderWidgets'



const WidgetsTemplate = {
  widgets:[   
    {
      type: 'eventslog',
      width: 4,
      title: 'Журнал событий',
    }      
  ]
}



export default function DeviceEventsLogPage(props) {
  const device_id = props.device_id;
  
  // render the page
  return (
    <React.Fragment>
      <DeviceHeader device_id={device_id}/>
      <RenderWidgets widgetsTemplate={WidgetsTemplate} device_id={device_id}/>
    </React.Fragment>
  );
}

 