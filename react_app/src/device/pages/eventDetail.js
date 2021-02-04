import React, {useState, useEffect} from 'react' 
import {useParams} from 'react-router-dom'

import Loader from '../../base/components/Loader'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()


export default function EventDetailPage(props) {
  let { event_id } = useParams();
  const [event, setEvent] = useState({})
  const [loading, setLoading] = React.useState(true)
  const device_id = props.device_id;

  function readEventDetail( cb = ()=>{} ) {
    axiosInstance.get(BASE_URL + "/events/config/", { params: { id: device_id, events_id: [event_id] }} )
    .then((responce) => {
      responce && setEvent(responce.data[0])  
      cb()   
    })  
  }
  
  useEffect(() => {
    readEventDetail( ()=>{setLoading(false)} );
  }, [])

  return (
    <React.Fragment>
        <h3 className='mb-3'>Настройка событй устройства</h3>
          <div className='p-3 mx-1 my-0 bg-dark rounded text-light' style={{minHeight: 'calc(100vh - 135px)'}}>
          { loading ? 
            <div className='d-flex justify-content-center'><Loader /></div> : 
            <EventForm event={event} />
          }
          </div>
    </React.Fragment>
  );
}



function EventForm(props) {
  const event = props.event
  return (
    <>
      <p> id: {event.id} </p>
      <p> device: {event.device} </p>
      <p> categories: {event.categories} </p>
      <p> enable: {event.enable} </p>
      <p> expression: {event.expression} </p>
      <p> raise_message: {event.raise_message} </p>
      <p> fall_message: {event.fall_message} </p>
      <p> is_alarm: {event.is_alarm} </p>
      <p> is_active: {event.is_active} </p>
      <p> raise_time: {event.raise_time} </p>
      <p> used_tags: {event.used_tags} </p>
    </>
  )
}