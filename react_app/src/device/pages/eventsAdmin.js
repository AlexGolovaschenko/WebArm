import React, {useState, useEffect} from 'react' 
import {NavLink} from 'react-router-dom'

import Loader from '../../base/components/Loader'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()


export default function EventsAdminPage(props) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = React.useState(true)
  const device_id = props.device_id;

  function readEventsConfig( cb = ()=>{} ) {
    axiosInstance.get(BASE_URL + "/events/config/", { params: { id: device_id }} )
    .then((responce) => {
      responce && setEvents(responce.data)  
      cb()   
    })  
  }
  
  useEffect(() => {
    readEventsConfig( ()=>{setLoading(false)} );
  }, [])

  return (
    <React.Fragment>
        <h3 className='mb-3'>Настройка событй устройства</h3>
          <div className='p-3 mx-1 my-0 bg-dark rounded text-light' style={{minHeight: 'calc(100vh - 135px)'}}>
          { loading ? 
            <div className='d-flex justify-content-center'><Loader /></div> : 
            <EventsList events={events} device_id={device_id}/>
          }
          </div>
    </React.Fragment>
  );
}

function EventsList(props) {
  const events = props.events
  const device_id = props.device_id

  return (
    <React.Fragment>
      <table className="table table-dark table-sm table-hover">
        <thead>
          <tr className='text-secondary'>
            <th className='border-0'>№</th>
            <th className='border-0'>Событие</th>
            <th className='border-0'>Контролируется</th>
            <th className='border-0'>Сейчас активны</th>
          </tr>
        </thead>
        <tbody>
          <EventsListEntry events={events} device_id={device_id}/>
        </tbody>
      </table>
    </React.Fragment>
  )
}

function EventsListEntry(props) {
  const events = props.events
  const device_id = props.device_id

  return (
    <React.Fragment>
      { events.map((event, index)=>{
        return ( 
          <React.Fragment key={index}> 
            <tr> 
              <td className='text-secondary py-2'>{index+1}</td>
              <td className='py-0'>
                  <NavLink to={`/device/${device_id}/admin/events/${event.id}/detail/`} className='btn btn-link w-100 text-left pl-0 py-2 text-light'>
                    {event.raise_message ? event.raise_message : <i className='text-secondary'>Сообщение не задано ...</i>}
                  </NavLink>
              </td>
              <td>{event.enable ? <button className='btn btn-outline-dark fas fa-check text-success'></button> : 
                                  <button className='btn btn-outline-dark fas fa-times text-secondary' style={{fontSize:'1.3rem'}}></button>}
              </td>
              <td>{event.is_active ? <i className='fas fa-exclamation-triangle text-warning ml-3 py-2'></i> : ''}</td>
            </tr> 
          </React.Fragment>
        )
        })
      }
    </React.Fragment>
  )
}