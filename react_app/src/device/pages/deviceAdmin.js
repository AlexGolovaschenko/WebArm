import React from 'react' 
import {Switch, Route, useParams} from "react-router-dom"

import TagDetailPage, {TagCreatePage} from './tagDetail'
import DeviceConfigPage from './deviceDetail'
import Page404 from '../../base/pages/pageNotFound'
import DeviceStatusBar from '../components/AdminPageDeviceStatusBar'




export default function DeviceAdminPage() {
  const { device_id } = useParams();

  return (
    <React.Fragment>
      <h3 className='mb-3'>Настройка параметров прибора</h3>
      <div className='px-3 pb-3 pt-2 mx-1 my-0 bg-dark rounded text-light' style={{minHeight: 'calc(100vh - 135px)'}}>
        <DeviceStatusBar device_id={device_id}/>
        <Switch>
          <Route exact path={'/device/:device_id/admin/config/'} component={()=><DeviceConfigPage/>} />
          <Route exact path={`/device/:device_id/admin/config/tags/:tag_id/detail/`} component={()=><TagDetailPage/>} />
          <Route exact path={`/device/:device_id/admin/config/tags/create/`} component={()=><TagCreatePage/>} />
          <Route component={Page404} />
        </Switch> 
      </div>
    </React.Fragment>
  )
}



