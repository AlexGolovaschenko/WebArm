import React from 'react' 
import {Switch, Route} from 'react-router-dom'

import Sidebar from '../../components/BaseParts/DeviceSidebar'
import DeviceOverviewPage from './overview'
import DeviceSettingsPage from './settings'
import DeviceEventsLogPage from './eventsLog'
import DeviceGraphsPage from './graphs'
import Page404 from '../pageNotFound'

export default function DeviceApp() { 
  return (
    <React.Fragment>
      <div className='bg-color-dark-gray text-secondary h-100'>
      <div className="row m-0 p-0">
        <Sidebar />
        <div className="col-10 m-0 p-0">
          <div className="content-height p-3">
            <Switch>
              <Route exact path='/device' component={DeviceOverviewPage} />
              <Route exact path='/device/overview' component={DeviceOverviewPage} />
              <Route exact path='/device/settings' component={DeviceSettingsPage} />
              <Route exact path='/device/events' component={DeviceEventsLogPage} />
              <Route exact path='/device/graphs' component={DeviceGraphsPage} />
              <Route component={Page404} />
            </Switch>
          </div>
        </div>
      </div>
      </div>
    </React.Fragment>
  );
}

