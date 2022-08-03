import React, {useState, useEffect} from 'react' 
import {useHistory, useParams} from 'react-router-dom'

import Loader from '../../base/components/Loader'
import {CheckboxField, SelectField, TextField, FormContainer, getSelectedOptions} from '../../base/forms/forms'

import {
  getEventsConfig,
  postEventsConfig,
  deleteEvents,
} from '../../backendAPI/backendAPI'


export default function EventDetailPage() {
  const { event_id, device_id } = useParams();
  const [event, setEvent] = useState({})
  const [eventFormErrors, setEventFromErrors] = useState(null)
  const [loading, setLoading] = React.useState(true)
  const history = useHistory()

  function submitEventParameters( event ) {
    postEventsConfig(device_id, [event], 
      ()=>{ 
        setEventFromErrors(null);
        history.push(`/device/${device_id}/admin/events/`); 
      },
      (errors_data)=>{ setEventFromErrors(errors_data[0]); }
    )
  }

  const cancelChanges = () => { 
    history.push(`/device/${device_id}/admin/events/`)
  }

  const deleteEvent = () => { 
    deleteEvents(device_id, [event_id], ()=>{
      history.push(`/device/${device_id}/admin/events/`)
    }) 
  }

  useEffect(() => {
    getEventsConfig(device_id, [event_id], (data)=>{
      setEvent(data[0]);
      setLoading(false);
    }) 
  }, [])

  return (
    <React.Fragment>
        <h3 className='mb-3'>Параметры события</h3>
        <div className='p-3 mx-1 my-0 rounded desk-bg-color-secondary desk-text-color-primary' style={{minHeight: 'calc(100vh - 135px)'}}>
        { loading ? 
          <div className='d-flex justify-content-center'><Loader /></div> :
          <FormContainer> 
            <h5 className='text-info text-center mb-3'>Редактирование параметров события</h5>  
            <EventForm event={event} formErrors={eventFormErrors} onSubmit={submitEventParameters} onCancel={cancelChanges} onDelete={deleteEvent}/>
          </FormContainer>
        }
        </div>
    </React.Fragment>
  );
}



export function EventCreatePage() {
  const { device_id } = useParams();
  const defaultEventSettings = { device: device_id, enable: false, category: 'Alarm' }
  const [eventFormErrors, setEventFromErrors] = useState(null)
  const history = useHistory()

  function submitEventParameters( event ) {
    postEventsConfig(device_id, [event], 
      ()=>{ 
        setEventFromErrors(null);
        history.push(`/device/${device_id}/admin/events/`); 
      },
      (errors_data)=>{ setEventFromErrors(errors_data[0]); }
    )
  }

  const cancelChanges = () => { 
    history.push(`/device/${device_id}/admin/events/`)
  }

  return (
    <React.Fragment>
        <h3 className='mb-3'>Параметры события</h3>
        <div className='p-3 mx-1 my-0 rounded desk-bg-color-secondary desk-text-color-primary' style={{minHeight: 'calc(100vh - 135px)'}}>
          <FormContainer>
            <h5 className='text-info text-center mb-3'>Создание нового события</h5>  
            <EventForm event={defaultEventSettings} formErrors={eventFormErrors} onSubmit={submitEventParameters} onCancel={cancelChanges}/>
          </FormContainer>
        </div>
    </React.Fragment>
  );
}



// -------------------------------------------------------------------------------------------------------------------
function EventForm(props) {
  const [event, setEvent] = useState(props.event)
  const onSubmit = props.onSubmit
  const onCancel = props.onCancel
  const onDelete = props.onDelete
  const buttonsStyle = {minWidth: '150px'}
  let categoriesOptions = [
    {value: 'Alarm',    name:'Аварйное'}, 
    {value: 'Warning',  name:'Предупреждение'}, 
    {value: 'Info',     name:'Информационное'}, 
    {value: 'Debug',    name:'Отладочное'}
  ]

  const handlSubmit = (e) => { 
    e.preventDefault();
    onSubmit(event);
  }
  const handlEnableChange = (e) => { setEvent({...event, enable: e.target.checked}) }
  const handlExpressionChange = (e) => { setEvent({...event, expression: e.target.value}) }
  const handlRaiseMessageChange = (e) => { setEvent({...event, raise_message: e.target.value}) }
  const handlFallMessageChange = (e) => { setEvent({...event, fall_message: e.target.value}) }
  const handlСategoriesChange = (e) => { setEvent({...event, category: getSelectedOptions(e)[0]}) }

  return (
    <React.Fragment>
      <form onSubmit={handlSubmit}>
        <CheckboxField titel={'Активировать контроль события'} id={'enable'} checked={event.enable} onChange={handlEnableChange}
          errors={props.formErrors ? props.formErrors.enable : null}
        />

        <TextField titel={'Формула'} id={'expression'} placeholder={'...'} value={event.expression} onChange={handlExpressionChange}
          errors={props.formErrors ? props.formErrors.expression : null}
          comment={
            <div>
            <button type='button' className='mt-3 btn btn-sm btn-outline-info' data-toggle="collapse" data-target="#expressions_help">
              Справка <i className='far fa-question-circle'></i>
            </button>
            <p id="expressions_help" className="collapse mt-3 border-top border-bottom border-info py-3">
            В формуле допустимо применение следующих конструкций: <br/>
            - получить текущее значение тега <kbd className='ml-2'>{'{{tag_code}}'}</kbd>  <br/>
            - операторы сравнения
            <kbd className='ml-2' title="Равно">{'=='}</kbd>
            <kbd className='ml-2' title="Неравно">{'!='}</kbd>
            <kbd className='ml-2' title="Больше">{'>'}</kbd>
            <kbd className='ml-2' title="Меньше">{'<'}</kbd>
            <kbd className='ml-2' title="Больше или равно">{'>='}</kbd>
            <kbd className='ml-2' title="Меньше или равно">{'<='}</kbd>
            <br/>
            - арифметические операторы
            <kbd className='ml-2' title="Суммирование">{'+'}</kbd>
            <kbd className='ml-2' title="Вычитание">{'-'}</kbd>
            <kbd className='ml-2' title="Деление">{'/'}</kbd>
            <kbd className='ml-2' title="Деление без остатка">{'//'}</kbd>
            <kbd className='ml-2' title="Остаток от деления">{'%'}</kbd>
            <kbd className='ml-2' title="Умножение">{'*'}</kbd>
            <kbd className='ml-2' title="Возведение в степень">{'**'}</kbd>
            <br/>
            - логические операторы
            <kbd className='ml-2' title="Логическое И">{'and'}</kbd>
            <kbd className='ml-2' title="Логическое ИЛИ">{'or'}</kbd>
            <kbd className='ml-2' title="Логическая инверсия">{'not'}</kbd>
            <br/>
            - битовые операторы
            <kbd className='ml-2' title="Битовое И">{'&'}</kbd>
            <kbd className='ml-2' title="Битовое ИЛИ">{'|'}</kbd>
            <kbd className='ml-2' title="Битовое исключающее ИЛИ">{'^'}</kbd>
            <kbd className='ml-2' title="Побитовая инверсия">{'~'}</kbd>
            <kbd className='ml-2' title="Побитовый сдвиг в лево">{'<<'}</kbd>
            <kbd className='ml-2' title="Побитовый сдвиг в право">{'>>'}</kbd>
            <br/>
            Примеры формул:  <br/>
            - является ли значение тега tag1 больше или равно 12.5 <kbd className='ml-2'>{'{{tag2}} >= 12.5'}</kbd> <br/>
            - получение значения бита №5 тега tag2 <kbd className='ml-2'>{'{{tag2}} >> 5 & 1'}</kbd>  <br/>
            - значение бита №0 тега tag2 или значение бита №14 тега tag3 <kbd className='ml-2'>{'({{tag2}} & 1) or ({{tag3}} >> 14 & 1)'}</kbd> 
          </p>
          </div>
          }
        />

        <TextField titel={'Сообщение срабатывания'} id={'raise_message'} placeholder={'...'} value={event.raise_message} 
          onChange={handlRaiseMessageChange}
          errors={props.formErrors ? props.formErrors.raise_message : null}
        />
        <TextField titel={'Сообщение отключения'} id={'fall_message'} placeholder={'...'} value={event.fall_message} 
          onChange={handlFallMessageChange}
          errors={props.formErrors ? props.formErrors.fall_message : null}
        />
        <SelectField titel={'Категория'} id={'category'} placeholder={'...'} value={event.category} 
          options={categoriesOptions} 
          onChange={handlСategoriesChange}
          errors={props.formErrors ? props.formErrors.category : null}
        />

        <p className='border-top border-secondary'></p>        
        <div className='row'>
          <p className='col-md-6'> Текущее состояние:  
              {event.is_active ? <span className='text-warning'> АКТИВНО </span> : 
                                 <span className='text-light'> НЕ АКТИВНО </span>
              } 
          </p>
          <p className='col-md-6'> Время последнего срабтывания:  
              {event.raise_time ? <span> {format_time(event.raise_time)} </span>: 
                                  <span className='text-secondary'> Никогда </span>
              } 
          </p>
        </div>

        <p className='border-top border-secondary'></p>
        <div className='d-flex flex-wrap justify-content-center'>
          <button type="submit" className="btn btn-outline-primary m-2" style={buttonsStyle}>Сохранить</button>
          <button type="button" className="btn btn-outline-secondary m-2" style={buttonsStyle} onClick={onCancel}>Отмена</button>
          { props.onDelete && <button type="button" className="btn btn-outline-danger m-2" style={buttonsStyle} onClick={onDelete}>Удалить</button> }
        </div>

      </form>
    </React.Fragment>
  )
}



function format_time(time, date_style='long', time_style='medium') {
  const s = new Date(time)
  let formatter = new Intl.DateTimeFormat([] , {dateStyle: date_style, timeStyle: time_style});
  return formatter.format(s)
}


