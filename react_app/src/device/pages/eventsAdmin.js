import React, {useState, useEffect} from 'react' 
import {NavLink, useParams} from 'react-router-dom'

import Loader from '../../base/components/Loader'
import axiosInstance from "../../backendAPI/axiosApi";
import getBaseUrl from '../../backendAPI/localSettings'
const BASE_URL = getBaseUrl()


export default function EventsAdminPage(props) {
  const { device_id } = useParams();
  const [events, setEvents] = useState([])
  const [deviceData, setDeviceData] = React.useState({})
  const [loading, setLoading] = React.useState(true)

  function readDeviceParameters() {
    axiosInstance.get(BASE_URL + "/device/parameters/", { params: { id: device_id }} )
      .then(responce => { 
        responce && setDeviceData({...responce.data}) 
      }) 
  }

  function readEventsConfig( cb = ()=>{} ) {
    axiosInstance.get(BASE_URL + "/events/config/", { params: { id: device_id }} )
    .then((responce) => {
      responce && setEvents(responce.data)  
      cb()   
    })  
  }

  function deleteEvent(event_id) {
    axiosInstance.delete(BASE_URL + "/events/config/", { params: { id: device_id, events_id: [event_id] }} )
    .then(() => {
      setEvents(
        events.filter((event)=>{
          return event_id === event.id ? false : true
        })
      )
    })  
  }  

  function toggleEventEnable(event) {
    const body = [{...event, enable: !event.enable}]  
    const params = { id: device_id, events_id: [event.id] }
    axiosInstance.post(BASE_URL + "/events/config/", body, { params: params} )
    .then((responce) => {
      console.log(responce.data); 
      const ev = events.map((event)=>{
        return responce.data[0].id === event.id ? {...responce.data[0]} : event
      })
      setEvents(ev)
    })  
  }

  useEffect(() => {
    readEventsConfig( ()=>{setLoading(false)} );
    readDeviceParameters();
  }, [])

  return (
    <React.Fragment>
        <h3 className='mb-3'>Настройка событй устройства</h3>
          <div className='p-3 mx-1 my-0 bg-dark rounded text-light' style={{minHeight: 'calc(100vh - 135px)'}}>
            { loading ? 
              <div className='d-flex justify-content-center'><Loader /></div> : 
              <React.Fragment>
                <div className='d-flex mb-3 border-bottom border-secondary pb-3'>
                  <h4 className='pt-1 text-info'>Список событий устройства "{deviceData.name}"</h4>
                  <NavLink  to={`/device/${device_id}/admin/events/create/`} 
                            className='btn btn-outline-info ml-auto'
                            device_id={device_id}
                  >
                    Добавить новое событие <i className=''></i>
                  </NavLink>
                </div>

                { events.length > 0 ?
                  <EventsList events={events} device_id={device_id} handlEventDelete={deleteEvent} toggleEventEnable={toggleEventEnable}/>
                  :
                  <NoEvents />
                }
              </React.Fragment>
            }

          </div>
    </React.Fragment>
  );
}



function EventsList(props) {
  const events = props.events
  const device_id = props.device_id
  const handlEventDelete = props.handlEventDelete
  const toggleEventEnable = props.toggleEventEnable

  return (
    <React.Fragment>
      <table className="table table-dark table-sm table-hover mb-0">
        <thead>
          <tr className='text-secondary'>
            <th className='border-0'>№</th>
            <th className='border-0'>Событие</th>
            <th className='border-0'>Контролируется</th>
            <th className='border-0'>Сейчас активны</th>
            <th className='border-0'>Удалить</th>
          </tr>
        </thead>
        <tbody>
          <EventsListEntry events={events} device_id={device_id} handlEventDelete={handlEventDelete} toggleEventEnable={toggleEventEnable}/>
        </tbody>
      </table>
    </React.Fragment>
  )
}



function EventsListEntry(props) {
  const events = props.events
  const device_id = props.device_id
  const handlEventDelete = props.handlEventDelete
  const toggleEventEnable = props.toggleEventEnable

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

              <td>{event.enable ? <button className='btn btn-outline-dark fas fa-check text-success' 
                                          onClick={() => toggleEventEnable(event)}
                                  ></button> : 
                                  <button className='btn btn-outline-dark fas fa-times text-secondary' 
                                          style={{fontSize:'1.3rem'}} 
                                          onClick={() => toggleEventEnable(event)}
                                  ></button>}
              </td>

              <td>{event.is_active ? <i className='fas fa-exclamation-triangle text-warning ml-3 py-2' style={{fontSize:'1.1rem'}}></i> : ''}</td>

              <td>  <button className='btn btn-outline-dark fas fa-times text-danger' 
                            style={{fontSize:'1.2rem'}}
                            onClick={() => handlEventDelete(event.id)}
                    ></button> 
              </td>
            </tr> 
          </React.Fragment>
        )
        })
      }
    </React.Fragment>
  )
}



function NoEvents() {
  return <i className='text-secondary '>События отсутствуют ...</i>
}