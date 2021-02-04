import React, {useEffect} from 'react' 
import {Switch, Route, useParams} from 'react-router-dom'

import axiosInstance from "../utils/axiosApi"
import getBaseUrl from '../utils/localSettings'
import sortWidgetsByOrder from './utils/sortWidgetsByOrder'

import Sidebar from './components/DeviceSidebar'
import DeviceOverviewPage from './pages/overview'
import DeviceSettingsPage from './pages/settings'
import DeviceEventsLogPage from './pages/eventsLog'
import DeviceGraphsPage from './pages/graphs'
import DeviceAdminPage from './pages/deviceAdmin'
import WidgetsAdminPage from './pages/widgetsAdmin'
import EventsAdminPage from './pages/eventsAdmin'
import EventDetailPage from './pages/eventDetail'
import Page404 from '../base/pages/pageNotFound'

const BASE_URL = getBaseUrl()



export default function DeviceApp() { 
  let { id } = useParams();
  const [widgetsTemplate, setWidgetsTemplate] = React.useState({})

  useEffect(() => {
    getWidgetsTemplate( id, (data)=> {
      setWidgetsTemplate( sortWidgetsByOrder(data.template) );
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
              <Route exact path={`/device/${id}/admin/events/`} component={()=><EventsAdminPage device_id={id}/>} />
              <Route exact path={`/device/${id}/admin/events/:event_id/detail/`} component={()=><EventDetailPage device_id={id}/>} />
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


