import React, {useEffect} from 'react' 
import {Switch, Route, useParams} from 'react-router-dom'

import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'

import Sidebar from '../../components/BaseParts/DeviceSidebar'
import DeviceOverviewPage from './overview'
import DeviceSettingsPage from './settings'
import DeviceEventsLogPage from './eventsLog'
import DeviceGraphsPage from './graphs'
import DeviceAdminPage from './deviceAdmin'
import WidgetsAdminPage from './widgetsAdmin'
import Page404 from '../pageNotFound'

const BASE_URL = getBaseUrl()



export default function DeviceApp() { 
  let { id } = useParams();
  const [widgetsTemplate, setWidgetsTemplate] = React.useState({})

  useEffect(() => {
    getWidgetsTemplate( id, (data)=> {
      setWidgetsTemplate(data.template);
    });   
  }, []) 

  function updateWidgetsTemplate(newTemplate){
    setWidgetsTemplate(newTemplate)
    postWidgetsTemplate(id, newTemplate)
  }

  return (
    <React.Fragment>
      <div className='bg-color-dark-gray text-secondary h-100'>
      <div className="row m-0 p-0">
        <Sidebar deviceId={id}/>
        <div className="col-10 m-0 p-0">
          <div className="content-height p-3">
            <Switch>
              <Route exact path={`/device/${id}/overview/`} 
                component={()=><DeviceOverviewPage device_id={id} widgetsTemplate={widgetsTemplate}/>} 
              />
              <Route exact path={`/device/${id}/settings/`} component={()=><DeviceSettingsPage device_id={id}/>} />
              <Route exact path={`/device/${id}/events/`} component={()=><DeviceEventsLogPage device_id={id}/>} />
              <Route exact path={`/device/${id}/graphs/`} component={()=><DeviceGraphsPage device_id={id}/>} />
              <Route exact path={`/device/${id}/admin/config/`} component={()=><DeviceAdminPage device_id={id}/>} />
              <Route exact path={`/device/${id}/admin/widgets/`} 
                component={()=><WidgetsAdminPage device_id={id} updateWidgetsTemplate={updateWidgetsTemplate} widgetsTemplate={widgetsTemplate}/>} 
              />
              <Route component={Page404} />
            </Switch>
          </div>
        </div>
      </div>
      </div>
    </React.Fragment>
  );
}


async function getWidgetsTemplate(device_id, cb) {
  const request = await axiosInstance.get(BASE_URL + "/widgets/template/", { params: { id: device_id }})
  cb({...request.data});
}

async function postWidgetsTemplate(device_id, template_data, cb) {
  const body = {'template': template_data}
  const request = await axiosInstance.post(BASE_URL + "/widgets/template/", body, { params: { id: device_id }})
  cb && cb({...request.data});
}


// const defaultWidgetsTemplate = {
//   widgets:[
//     {
//       type: 'indicator',
//       width: 1,
//       title: 'Температура зоны 1',
//       addTextLeft: '',
//       addTextRight: '°C',      
//       tags: ['PT1'],                
//     },
//     {
//       type: 'indicator',
//       width: 1,
//       title: 'Температура зоны 2',
//       addTextLeft: '',      
//       addTextRight: '°C',
//       tags: ['PT2'],               
//     },
//     {
//       type: 'indicator',
//       width: 1,
//       title: 'Влажность в помещении',
//       addTextRight: '%',      
//       tags: ['RH1'],   
//     },
//     {
//       type: 'indicator',
//       width: 1,
//       title: 'Влажность наружного воздуха',
//       addTextRight: '%',  
//       tags: ['RH2'],   
//     },
//     {
//       type: 'table',
//       width: 2,
//       title: 'Таблица параметров 2',
//       tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
//       fields: ['#No', 'code', 'name', 'value']              
//     },    
//     {
//       type: 'table',
//       width: 2,
//       title: 'Таблица параметров 2',
//       tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
//       fields: ['#No', 'code', 'name', 'value']              
//     },    
//     {
//       type: 'graph',
//       width: 2,
//       title: 'Температура в теплице',
//       tags: ['RT', 'PT1', 'PT2', 'PT3', 'PT4'],
//       legend: true,
//       toolbar: true,
//     },    
//     {
//       type: 'graph',
//       width: 2,
//       title: 'Влажность',
//       tags: ['RH1', 'RH2'],
//       legend: true,
//       toolbar: true,
//     }      
//   ]
// }