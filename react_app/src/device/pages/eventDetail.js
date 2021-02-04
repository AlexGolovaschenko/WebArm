import React, {useState, useEffect} from 'react' 
import {useParams} from 'react-router-dom'

import Loader from '../../base/components/Loader'
import {CheckboxField, SelectField, TextField, getSelectedOptions} from '../../base/forms/forms'

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
  
  function postEventDetail( event, cb = ()=>{} ) {
    const body = [event]   
    const params = { id: device_id, events_id: [event_id] }
    axiosInstance.post(BASE_URL + "/events/config/", body, { params: params} )
    .then((responce) => {
      cb && cb(responce.data)
      device_id && (window.location.href = `/device/${device_id}/admin/events/`)
    })  
  }

  useEffect(() => {
    readEventDetail( ()=>{setLoading(false)} );
  }, [])

  return (
    <React.Fragment>
        <h3 className='mb-3'>Параметры события</h3>
          <div className='p-3 mx-1 my-0 bg-dark rounded text-light' style={{minHeight: 'calc(100vh - 135px)'}}>
          { loading ? 
            <div className='d-flex justify-content-center'><Loader /></div> : 
            <EventForm event={event} onSubmit={postEventDetail}/>
          }
          </div>
    </React.Fragment>
  );
}




export function EventCreatePage(props) {
  const device_id = props.device_id;
  const defaultEventSettings = { device: device_id, enable: false, categories: [] }
  
  function postEventDetail( event, cb = ()=>{} ) {
    const body = [event]   
    const params = { id: device_id }
    axiosInstance.post(BASE_URL + "/events/config/", body, { params: params} )
    .then((responce) => {
      cb && cb(responce.data)
      device_id && (window.location.href = `/device/${device_id}/admin/events/`)
    })  
  }

  return (
    <React.Fragment>
        <h3 className='mb-3'>Параметры события</h3>
          <div className='p-3 mx-1 my-0 bg-dark rounded text-light' style={{minHeight: 'calc(100vh - 135px)'}}>
            <EventForm event={defaultEventSettings} onSubmit={postEventDetail}/>
          </div>
    </React.Fragment>
  );
}



// -------------------------------------------------------------------------------------------------------------------
function EventForm(props) {
  const [event, setEvent] = useState(props.event)
  const onSubmit = props.onSubmit
  let categoriesOptions = ['Аварйное', 'Предупреждение', 'Информационное', 'Отладочное']

  const handlSubmit = (e) => { 
    e.preventDefault();
    onSubmit(event);
   }
  const handlEnableChange = (e) => { setEvent({...event, enable: e.target.checked}) }
  const handlExpressionChange = (e) => { setEvent({...event, expression: e.target.value}) }
  const handlRaiseMessageChange = (e) => { setEvent({...event, raise_message: e.target.value}) }
  const handlFallMessageChange = (e) => { setEvent({...event, fall_message: e.target.value}) }
  const handlСategoriesChange = (e) => { setEvent({...event, categories: getSelectedOptions(e)}) }

  return (
    <React.Fragment>
      <form onSubmit={handlSubmit}>
        <CheckboxField titel={'Активировать контроль события'} id={'enable'} checked={event.enable} onChange={handlEnableChange}/>  
        <TextField titel={'Формула'} id={'expression'} placeholder={'...'} value={event.expression} onChange={handlExpressionChange}/>
        <TextField titel={'Сообщение срабатывания'} id={'raise_message'} placeholder={'...'} value={event.raise_message} onChange={handlRaiseMessageChange}/>
        <TextField titel={'Сообщение отключения'} id={'fall_message'} placeholder={'...'} value={event.fall_message} onChange={handlFallMessageChange}/>
        <SelectField 
          titel={'Категория'} 
          id={'categories'} 
          placeholder={'...'} 
          value={event.categories[0]} 
          options={categoriesOptions} 
          onChange={handlСategoriesChange}
        />

        <p className='border-top border-secondary'></p>        
        <div className='row'>
          <p className='col-md-6'> Текущее состояние:  
              {event.is_active ? <span className='text-warning'> АКТИВНО </span> : 
                                 <span className='text-light'> НЕ АКТИВНО </span>
              } 
          </p>
          <p className='col-md-6'> Время последнего срабтывания: 
              {event.raise_time ? format_time(event.raise_time) : 
                                  <span className='text-secondary'> Никогда </span>
              } 
          </p>
        </div>
        <p className='border-top border-secondary'></p>
        <button type="submit" className="btn btn-outline-primary">Сохранить</button>
      </form>
    </React.Fragment>
  )
}



function format_time(time, date_style='long', time_style='medium') {
  const s = new Date(time)
  let formatter = new Intl.DateTimeFormat([] , {dateStyle: date_style, timeStyle: time_style});
  return formatter.format(s)
}




// <p> id: {event.id} </p>
// <p> device: {event.device} </p>
// <p> categories: {event.categories} </p>
// <p> enable: {event.enable} </p>
// <p> expression: {event.expression} </p>
// <p> raise_message: {event.raise_message} </p>
// <p> fall_message: {event.fall_message} </p>
// <p> is_alarm: {event.is_alarm} </p>
// <p> is_active: {event.is_active} </p>
// <p> raise_time: {event.raise_time} </p>
// <p> used_tags: {event.used_tags} </p>