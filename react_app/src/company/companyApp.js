import React from 'react' 
import {Switch, Route} from 'react-router-dom'

import Sidebar from './components/CompanySidebar'
import CompanyOverviewPage from './pages/overview'
import EmployersPage from './pages/employers'
import FacilitiesOnMapPage from './pages/facilitiesOnMap'
import CompanyProfilePage from './pages/profile'
import Page404 from '../base/pages/pageNotFound'

export default function CompanyApp() { 

  return (
    <React.Fragment>
      <div className='desk-color-primary text-secondary h-100'>
      <div className="row m-0 p-0">
        <Sidebar />
        <div className="col-10 m-0 p-0">
          <div className="content-height">
            <Switch>
              <Route exact path='/company' component={CompanyOverviewPage} />
              <Route exact path='/company/overview' component={CompanyOverviewPage} />
              <Route exact path='/company/map' component={FacilitiesOnMapPage} />
              <Route exact path='/company/employers' component={EmployersPage} />
              <Route exact path='/company/profile' component={CompanyProfilePage} />
              <Route component={Page404} />
            </Switch>
          </div>
        </div>
      </div>
      </div>
    </React.Fragment>
  );
}

