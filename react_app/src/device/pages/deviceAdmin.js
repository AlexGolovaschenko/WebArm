import React, {useState, useEffect} from 'react' 
import {Switch, Route, useParams} from "react-router-dom"

import TagDetailPage, {TagCreatePage} from './tagDetail'
import DeviceConfigPage from './deviceDetail'
import Page404 from '../../base/pages/pageNotFound'
import Loader from '../../base/components/Loader'
import {getDeviceParameters} from '../../backendAPI/backendAPI'



export default function DeviceAdminPage() {
  return (
    <React.Fragment>
      <h3 className='mb-3'>Настройка параметров прибора</h3>
      <div className='px-3 pb-3 pt-2 mx-1 my-0 bg-dark rounded text-light' style={{minHeight: 'calc(100vh - 135px)'}}>
        <DeviceStatusBar />
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



// ----------------------------------------------------------------------------------------------------------------------------
function DeviceStatusBar () {
  const { device_id } = useParams();
  const [deviceParameters, setDeviceParameters] = useState({})
  const [loading, setLoading] = React.useState(true)

  useEffect(()=>{
    getDeviceParameters(device_id, (data)=>{
      setDeviceParameters(data)
      setLoading(false)
    })
  }, [])

  return (
    <React.Fragment>
      { loading ? 
        <div className='d-flex justify-content-center'><Loader /></div> 
        :
        <div className='d-flex border-bottom border-secondary mb-3 pb-2'>
          <h5 className='pt-2 mt-1'>Прибор: <b>{deviceParameters.name}</b></h5>
          <div className='ml-auto mx-3 px-3 border-x border-secondary'>
            { deviceParameters.is_online ? 
              <div className='text-success'>
                <span>Онлайн</span> <br/>
                <i className='fas fa-check text-center w-100'></i>
              </div>
            : <div className='text-danger'>
                <span>Нет связи</span> <br/>
                <i className='fas fa-times text-center w-100'></i>
              </div>
            }
          </div>
          <div>
            <p className='m-0 mr-1 text-right'>Последний сеанс связи: <br/> {deviceParameters.verbose_last_update}</p>
          </div>
        </div>
      }
    </React.Fragment>
  )
}

