import React, { useEffect } from 'react' 

import DeviceHeader from '../../components/BaseParts/DeviceHeader'
import RenderWidgets from '../../components/Widgets/renderWidgets'



const WidgetsTemplate = {
  widgets:[
    {
      type: 'indicator',
      size: 1,
      title: 'Температура зоны 1',
      addTextLeft: '',
      addTextRight: '°C',      
      tags: ['PT1'],                
    },
    {
      type: 'indicator',
      size: 1,
      title: 'Температура зоны 2',
      addTextLeft: '',      
      addTextRight: '°C',
      tags: ['PT2'],               
    },
    {
      type: 'indicator',
      size: 1,
      title: 'Влажность в помещении',
      addTextRight: '%',      
      tags: ['RH1'],   
    },
    {
      type: 'indicator',
      size: 1,
      title: 'Влажность наружного воздуха',
      addTextRight: '%',  
      tags: ['RH2'],   
    },
    {
      type: 'table',
      size: 2,
      title: 'Таблица параметров 2',
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
      fields: ['#No', 'code', 'name', 'value']              
    },    
    {
      type: 'table',
      size: 2,
      title: 'Таблица параметров 2',
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
      fields: ['#No', 'code', 'name', 'value']              
    },    
    {
      type: 'graph',
      size: 2,
      title: 'Температура в теплице',
      tags: ['RT', 'PT1', 'PT2', 'PT3', 'PT4'],
      legend: true,
      toolbar: true,
      history: 'last data',
      last: '12h',
      resolution: '10m'
    },    
    {
      type: 'graph',
      size: 2,
      title: 'Влажность',
      tags: ['RH1', 'RH2'],
      legend: true,
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

