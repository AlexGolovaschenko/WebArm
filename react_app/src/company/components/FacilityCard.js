import React from 'react';

import DeviceCard from './DeviceCard'

function FacilityCard(props) {
  const facilityInfo = props.facilityInfo   
  const devices = facilityInfo.devices

  const mapDeviceCards = (ds) => {
    return ds.map((device, index) => {
      return (
        <div key={device.id} className='col-lg-4 col-md-6 col-sm-12 p-1 m-0 h-100'>
          <DeviceCard device={device} index={index}/>
        </div>
      )
    })
  }

  return (
    <React.Fragment>
    <div className='card desk-bg-color-secondary desk-text-color-secondary shadow-sm p-0 m-0'>
      <h6 className='px-2 pt-2 pb-0 m-0'>{facilityInfo.name}</h6>
      <div className='container-fluid h-100 p-1 m-0 row'>
          {devices.length > 0 ? mapDeviceCards(devices) : <p className='desk-text-color-secondary p-1'>Устройств нет ...</p> }       
      </div>
    </div>    
    </ React.Fragment> 
  )                   
}

export default FacilityCard