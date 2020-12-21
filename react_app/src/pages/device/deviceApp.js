import React from 'react' 
import {Switch, Route, useParams} from 'react-router-dom'

import Sidebar from '../../components/BaseParts/DeviceSidebar'
import DeviceOverviewPage from './overview'
import DeviceSettingsPage from './settings'
import DeviceEventsLogPage from './eventsLog'
import DeviceGraphsPage from './graphs'
import DeviceAdminPage from './deviceAdmin'
import WidgetsAdminPage from './widgetsAdmin'
import Page404 from '../pageNotFound'

export default function DeviceApp() { 
  let { id } = useParams();
  const [widgetsTemplate, setWidgetsTemplate] = React.useState(defaultWidgetsTemplate)

  function updateWidgetsTemplate(newTemplate){
    setWidgetsTemplate(newTemplate)
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




const defaultWidgetsTemplate = {
  widgets:[

    {
      type: 'table',
      width: 4,
      title: 'Таблица параметров 2',
      tags: ['TEMP1', 'TEMP2', 'TEMP3'],   
      fields: ['#No', 'code', 'name', 'value']              
    },    
   
    {
      type: 'graph',
      width: 4,
      title: 'Температура в теплице',
      tags: [],
      legend: true,
      toolbar: true,
    },    
    
  ]
}