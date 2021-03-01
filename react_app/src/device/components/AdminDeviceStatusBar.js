import React from 'react' 


export default function AdminDeviceStatusBar (props) {
    return (
      <div className='d-flex border-bottom border-secondary mb-3 pb-2'>
        <h5 className='pt-2 mt-1'>Прибор: <b>{props.deviceParameters.name}</b></h5>
        <div className='ml-auto mx-3 px-3 border-x border-secondary'>
          { props.deviceParameters.is_online ? 
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
          <p className='m-0 mr-1 text-right'>Последний сеанс связи: <br/> {props.deviceParameters.verbose_last_update}</p>
        </div>
      </div>
    )
  }