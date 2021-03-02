import React, {useState, useEffect} from 'react' 

import Loader from '../../base/components/Loader'
import {getDeviceParameters} from '../../backendAPI/backendAPI'



export default function DeviceStatusBar (props) {
    const device_id = props.device_id;
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
  
  