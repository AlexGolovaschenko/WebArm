import React, {useState, useEffect} from 'react' 
import {useHistory, useParams} from "react-router-dom"

import Loader from '../../base/components/Loader'

import {
  getDeviceParameters, postDeviceParameters, getDeviceModbusParameters, 
  postDeviceModbusParameters, getDeviceTagsParameters
} from '../../backendAPI/backendAPI'

import { TextField, NumberField, SelectField, 
  CheckboxField, getSelectedOptions, ErrorMessage
} from '../../base/forms/forms'


export default function DeviceConfigPage() {
  const { device_id } = useParams()
  const [deviceParameters, setDeviceParameters] = useState({})
  const [deviceParametersFormErrors, setDeviceParametersFormErrors] = useState(null)
  const [deviceModbusParameters, setDeviceModbusParameters] = useState({})
  const [deviceModbusParametersFormErrors, setDeviceModbusParametersFormErrors] = useState(null)
  const [deviceTagsParameters, setDeviceTagsParameters] = useState([])
  const [loading1, setLoading1] = React.useState(true)
  const [loading2, setLoading2] = React.useState(true)
  const [loading3, setLoading3] = React.useState(true)

  useEffect(()=>{
    getDeviceParameters(device_id, (data)=>{
      setDeviceParameters(data)
      setLoading1(false)
    })
    getDeviceModbusParameters(device_id, (data)=>{
      setDeviceModbusParameters(data)
      setLoading2(false)
    })
    getDeviceTagsParameters(device_id, [], (data)=>{
      setDeviceTagsParameters(data)
      setLoading3(false)
    })
  }, [])

  const submitDeviceConfig = (device_parameters) => {
    postDeviceParameters(device_id, device_parameters, 
      (responce_data)=>{ setDeviceParameters(responce_data); setDeviceParametersFormErrors(null); },
      (errors_data)=>{ setDeviceParametersFormErrors(errors_data); },
    )
  }
  const submitModbusParameters = (modbus_parameters) => {
    postDeviceModbusParameters(device_id, modbus_parameters, 
      (responce_data)=>{ setDeviceModbusParameters(responce_data); setDeviceModbusParametersFormErrors(null); },
      (errors_data)=>{ setDeviceModbusParametersFormErrors(errors_data); }
    )
  }

  return (
    <React.Fragment>
      { loading1 || loading2 || loading3 ? 
        <div className='d-flex justify-content-center'><Loader /></div> 
        :
        <div className='row'>
          <div className='col-12 col-lg-5'>
            <DeviceConfigsForm deviceParameters={deviceParameters} formErrors={deviceParametersFormErrors} submitDeviceConfig={submitDeviceConfig} />
            <p className='my-3 border-top border-secondary'></p>
            <DeviceModbusParametersForm deviceModbusParameters={deviceModbusParameters} formErrors={deviceModbusParametersFormErrors} submitModbusParameters={submitModbusParameters} />
          </div>
          <div className='col-12 col-lg-7 border-left border-secondary'>
            <p className='my-3 d-lg-none border-top border-secondary'></p>
            <TagsList deviceTagsParameters={deviceTagsParameters} device_id={device_id} />
          </div>
        </div>
      }
    </React.Fragment>
  )
}



// ----------------------------------------------------------------------------------------------------------------------------
function DeviceConfigsForm(props) {
  const [parameters, setParameters] = useState(props.deviceParameters)
  const onSubmit = props.submitDeviceConfig

  const handlNameChange = (e) => { setParameters({...parameters, name: e.target.value}) }
  const handlTimeoutChange = (e) => { setParameters({...parameters, timeout: e.target.value}) }
  const handlPollingPeriodChange = (e) => { setParameters({...parameters, polling_period: e.target.value}) }

  const handlSubmit = (e) => { 
    e.preventDefault();
    onSubmit(parameters);
  }

  return (
    <React.Fragment>
      <form onSubmit={handlSubmit}>
        <h5 className='text-info'>Параметры прибора</h5>
        <TextField titel={'Наименование прибора'} id={'name'} placeholder={'...'} value={parameters.name} onChange={handlNameChange}
          errors={props.formErrors ? props.formErrors.name : null}
        />
        <NumberField titel={'Период опроса (сек)'} id={'polling_period'} placeholder={'...'} value={parameters.polling_period} min={1} 
          onChange={handlPollingPeriodChange}
          errors={props.formErrors ? props.formErrors.polling_period : null}
        />
        <NumberField titel={'Таймаут соединения (сек)'} id={'timeout'} placeholder={'...'} value={parameters.timeout} 
          onChange={handlTimeoutChange}
          errors={props.formErrors ? props.formErrors.timeout : null}
        />

        <ErrorMessage>
          {props.formErrors && props.formErrors.non_field_errors ? <div className='card bg-danger text-dark my-3 p-2'> {props.formErrors.non_field_errors}</div> : null }
        </ErrorMessage>

        <div className='d-flex justify-content-center'>
          <button type="submit" className="btn btn-outline-primary">Сохранить</button>
        </div>
      </form>
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------------------------------------------------------------
function DeviceModbusParametersForm(props) {
  const [parameters, setParameters] = useState(props.deviceModbusParameters)
  const onSubmit = props.submitModbusParameters

  const protocolTypeOptions = [    
    {value: 'RTU',    name:'Modbus-RTU'}, 
    {value: 'ASCII',  name:'Modbus-ASCII'}, 
    {value: 'TCP',     name:'Modbus-TCP'}
  ]
  const baudrateOptions = [    
    {value: 300,    name:'300'}, 
    {value: 600,    name:'600'}, 
    {value: 1200,   name:'1200'},
    {value: 2400,   name:'2400'},
    {value: 4800,   name:'4800'},
    {value: 9600,   name:'9600'},
    {value: 14400,  name:'14400'},
    {value: 19200,  name:'19200'},
    {value: 28800,  name:'28800'},
    {value: 38400,  name:'38400'},
    {value: 57600,  name:'57600'},
    {value: 115200, name:'115200'}
  ]
  const addressSizeOptions = [    
    {value: '8', name:'8'}
  ]
  const parityOptions = [
    {value: 'none', name: 'нет'},
    {value: 'even', name: 'четность'},
    {value: 'odd',  name: 'нечетность'}
  ]
  const stopBitOptions = [
    {value: '1', name: '1'},
    {value: '2',  name: '2'}
  ]

  const handlProtocolTypeChange = (e) => { setParameters({...parameters, protocol_type: getSelectedOptions(e)[0]}) }
  const handlDeviceAddressChange = (e) => { setParameters({...parameters, device_address: e.target.value}) }
  const handlBaudrateChange = (e) => { setParameters({...parameters, baudrate: getSelectedOptions(e)[0]}) }
  const handlAddressSizeChange = (e) => { setParameters({...parameters, address_size: getSelectedOptions(e)[0]}) }
  const handlParityChange = (e) => { setParameters({...parameters, parity: getSelectedOptions(e)[0]}) }
  const handlStopbitChange = (e) => { setParameters({...parameters, stopbit: getSelectedOptions(e)[0]}) }
  const handlPacketTimoutChange = (e) => { setParameters({...parameters, packet_timout: e.target.value}) }
  const handlBitTimoutChange = (e) => { setParameters({...parameters, bit_timout: e.target.value}) }
  const handlLowerByteForwardChange = (e) => { setParameters({...parameters, lower_byte_forward: e.target.checked}) }
  const handlLowerRegisterForwardChange = (e) => { setParameters({...parameters, lower_register_forward: e.target.checked}) }
  const handlAllowGroupReadingChange = (e) => { setParameters({...parameters, allow_group_reading: e.target.checked}) }

  const handlSubmit = (e) => { 
    e.preventDefault();
    onSubmit(parameters);
  }

  return (
    <React.Fragment>
      <form onSubmit={handlSubmit}>
        <h5 className='text-info'>Параметры протокола Modbus</h5>
        <SelectField titel={'Протокол'} id={'protocol_type'} value={parameters.protocol_type} options={protocolTypeOptions} 
          onChange={handlProtocolTypeChange} 
          errors={props.formErrors ? props.formErrors.protocol_type : null}
        />
        <NumberField titel={'Адрес устройства'} id={'device_address'} value={parameters.device_address} min={1} max={247} 
          onChange={handlDeviceAddressChange}
          errors={props.formErrors ? props.formErrors.device_address : null}
        />
        <SelectField titel={'Скорость передачи данных'} id={'baudrate'} value={parameters.baudrate} options={baudrateOptions} 
          onChange={handlBaudrateChange} 
          errors={props.formErrors ? props.formErrors.baudrate : null}
        />
        <SelectField titel={'Длинна адреса'} id={'address_size'} value={parameters.address_size} options={addressSizeOptions} 
          onChange={handlAddressSizeChange} 
          errors={props.formErrors ? props.formErrors.address_size : null}
        />
        <SelectField titel={'Контроль чётности'} id={'parity'} value={parameters.parity} options={parityOptions} 
          onChange={handlParityChange} 
          errors={props.formErrors ? props.formErrors.parity : null}
        />
        <SelectField titel={'Количество стоп-битов'} id={'stopbit'} value={parameters.stopbit} options={stopBitOptions} 
          onChange={handlStopbitChange} 
          errors={props.formErrors ? props.formErrors.stopbit : null}
        />
        <NumberField titel={'Таймаут запроса (мс)'} id={'packet_timout'} value={parameters.packet_timout} 
          onChange={handlPacketTimoutChange}
          errors={props.formErrors ? props.formErrors.packet_timout : null}
        />
        <NumberField titel={'Таймаут бита (мс)'} id={'bit_timout'} value={parameters.bit_timout} 
          onChange={handlBitTimoutChange}
          errors={props.formErrors ? props.formErrors.bit_timout : null}
        />
        <CheckboxField titel={'Младшим байтом вперед'} id={'lower_byte_forward'} checked={parameters.lower_byte_forward} 
          onChange={handlLowerByteForwardChange}
          errors={props.formErrors ? props.formErrors.lower_byte_forward : null}
        />  
        <CheckboxField titel={'Младшим регистром вперед'} id={'lower_register_forward'} checked={parameters.lower_register_forward} 
          onChange={handlLowerRegisterForwardChange}
          errors={props.formErrors ? props.formErrors.lower_register_forward : null}
        />  
        <CheckboxField titel={'Разрешить групповое чтение'} id={'allow_group_reading'} checked={parameters.allow_group_reading} 
          onChange={handlAllowGroupReadingChange}
          errors={props.formErrors ? props.formErrors.allow_group_reading : null}
        />  
        
        <ErrorMessage>
          {props.formErrors && props.formErrors.non_field_errors ? <div className='card bg-danger text-dark my-3 p-2'> {props.formErrors.non_field_errors}</div> : null }
        </ErrorMessage>

        <div className='d-flex justify-content-center'>
          <button type="submit" className="btn btn-outline-primary">Сохранить</button>
        </div>
      </form>
    </React.Fragment>
  );
}

// ----------------------------------------------------------------------------------------------------------------------------
function TagsList (props) {
  const tags = props.deviceTagsParameters
  const history = useHistory()

  const createNewTag = () => {
    history.push(`/device/${props.device_id}/admin/config/tags/create/`)
  }

  return (
    <React.Fragment>
      <div className='d-flex'>
        <h5 className='text-info'>Теги прибора</h5>
        <button type="button" className="btn btn-sm btn-outline-success ml-auto" onClick={createNewTag}> 
          <i className='fas fa-plus px-1'></i> Добавить новый тег
        </button>
      </div>

      { tags.length > 0 ?
        <div className="table-responsive">
          <table className="table table-hover table-dark table-striped table-sm desk-bg-color-secondary desk-text-color-primary desk-border-color-primary w-100 mb-0">
            <thead> 
              <tr>
                <th className='border-0 text-secondary font-weight-bold pl-2'>№</th>
                <th className='border-0 text-secondary font-weight-bold'>Код параметра</th>
                <th className='border-0 text-secondary font-weight-bold'>Тип данных</th>
                <th className='border-0 text-secondary font-weight-bold'>Наименование</th>
                <th className='border-0 text-secondary font-weight-bold'>Текущее значение</th>
              </tr>
            </thead>
            <tbody>
              {
                tags.map((tag, index)=>{
                  return ( <TagsListEntry key={index} tag={tag} index={index} device_id={props.device_id} /> )
                })
              }
            </tbody>
          </table>
        </div>
        :
        <i className='text-secondary ml-3'>Теги не заданы ... </i>
      }
    </React.Fragment>
  )
}


function TagsListEntry (props) {
  const tag = props.tag
  const history = useHistory()

  const goToTagDetail = (tag_id) => {
    history.push(`/device/${props.device_id}/admin/config/tags/${tag_id}/detail/`)
  }

  return (
    <tr className='table-row-like-link' onClick={()=> goToTagDetail(tag.id)}>
      <td className='border-0 text-secondary pl-2'> {props.index + 1} </td> 
      <td className='border-0'> {tag.code} </td>
      <td className='border-0'> {tag.data_type} </td>
      <td className='border-0'> {tag.name} </td>
      <td className='border-0'> {tag.value} </td>
    </tr>
  )
}




