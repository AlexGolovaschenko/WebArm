import React from 'react' 
import {Switch, Route} from 'react-router-dom'

import Sidebar from '../../components/BaseParts/CompanySidebar'
import CompanyOverviewPage from './overview'
import EmployersPage from './employers'
import FacilitiesPage from './facilities'
import CompanyProfilePage from './profile'
import Page404 from '../pageNotFound'

export default function CompanyApp() { 
  return (
    <React.Fragment>
      <div className='bg-color-dark-gray text-secondary h-100'>
      <div className="row m-0 p-0">
        <Sidebar />
        <div className="col-10 m-0 p-0">
          <div className="content-height">
            <Switch>
              <Route exact path='/company' component={CompanyOverviewPage} />
              <Route exact path='/company/overview' component={CompanyOverviewPage} />
              <Route exact path='/company/facilities' component={FacilitiesPage} />
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

