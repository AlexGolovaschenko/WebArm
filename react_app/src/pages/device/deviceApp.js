import React from 'react' 
import {Switch, Route, useParams} from 'react-router-dom'

import Sidebar from '../../components/BaseParts/DeviceSidebar'
import DeviceOverviewPage from './overview'
import DeviceSettingsPage from './settings'
import DeviceEventsLogPage from './eventsLog'
import DeviceGraphsPage from './graphs'
import Page404 from '../pageNotFound'

export default function DeviceApp() { 
  let { id } = useParams();

  return (
    <React.Fragment>
      <div className='bg-color-dark-gray text-secondary h-100'>
      <div className="row m-0 p-0">
        <Sidebar deviceId={id}/>
        <div className="col-10 m-0 p-0">
          <div className="content-height p-3">
            <Switch>
              <Route exact path={`/device/${id}/overview/`} component={()=><DeviceOverviewPage device_id={id}/>} />
              <Route exact path={`/device/${id}/settings/`} component={()=><DeviceSettingsPage device_id={id}/>} />
              <Route exact path={`/device/${id}/events/`} component={()=><DeviceEventsLogPage device_id={id}/>} />
              <Route exact path={`/device/${id}/graphs/`} component={()=><DeviceGraphsPage device_id={id}/>} />
              <Route component={Page404} />
            </Switch>
          </div>
        </div>
      </div>
      </div>
    </React.Fragment>
  );
}

