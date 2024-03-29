import React, {useEffect} from 'react' 
import {Switch, Route, useParams} from 'react-router-dom'

import {getWidgetsTemplate, postWidgetsTemplate} from "../backendAPI/backendAPI"
import sortWidgetsByOrder from './utils/sortWidgetsByOrder'

import Sidebar from './components/DeviceSidebar'
import DeviceOverviewPage from './pages/overview'
import DeviceSettingsPage from './pages/settings'
import DeviceEventsLogPage from './pages/eventsLog'
import DeviceGraphsPage from './pages/graphs'
import DeviceAdminPage from './pages/deviceAdmin'
import WidgetsAdminPage from './pages/widgetsAdmin'
import EventsAdminPage from './pages/eventsAdmin'
import EventDetailPage, {EventCreatePage} from './pages/eventDetail'
import Page404 from '../base/pages/pageNotFound'


export default function DeviceApp() { 
  let { id } = useParams();
  const [widgetsTemplate, setWidgetsTemplate] = React.useState({})

  useEffect(() => {
    getWidgetsTemplate( id, (data) => {
      setWidgetsTemplate( sortWidgetsByOrder(data.template) );
    });   
  }, []) 

  function updateWidgetsTemplate(newTemplate){
    setWidgetsTemplate(newTemplate)
    postWidgetsTemplate(id, newTemplate, null)
  }

  return (
    <React.Fragment>
      <div className='desk-bg-color-primary text-secondary h-100'>
      <div className="row m-0 p-0">
        <Sidebar deviceId={id}/>
        <div className="col-10 m-0 p-0">
          <div className="content-height p-2">
            <Switch>
              <Route exact path={`/device/:device_id/overview/`} component={()=><DeviceOverviewPage widgetsTemplate={widgetsTemplate}/>} />
              <Route exact path={`/device/:device_id/settings/`} component={()=><DeviceSettingsPage />} />
              <Route exact path={`/device/:device_id/events/`} component={()=><DeviceEventsLogPage />} />
              <Route exact path={`/device/:device_id/graphs/`} component={()=><DeviceGraphsPage />} />
              <Route path={`/device/:device_id/admin/config/`} component={()=><DeviceAdminPage />} />
              <Route exact path={`/device/:device_id/admin/widgets/`} 
                component={()=><WidgetsAdminPage updateWidgetsTemplate={updateWidgetsTemplate} widgetsTemplate={widgetsTemplate}/>} 
              />
              <Route exact path={`/device/:device_id/admin/events/`} component={()=><EventsAdminPage/>} />
              <Route exact path={`/device/:device_id/admin/events/:event_id/detail/`} component={()=><EventDetailPage/>} />
              <Route exact path={`/device/:device_id/admin/events/create/`} component={()=><EventCreatePage/>} />
              <Route component={Page404} />
            </Switch>
          </div>
        </div>
      </div>
      </div>
    </React.Fragment>
  );
}

