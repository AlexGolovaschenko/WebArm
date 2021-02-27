import React, {useState, useEffect} from 'react' 
import { useHistory, useParams } from "react-router-dom"

import Loader from '../../base/components/Loader'
import {
  getDeviceParameters, 
  postDeviceParameters, 
  getDeviceModbusParameters, 
  postDeviceModbusParameters,
  getDeviceTagsParameters
} from '../../backendAPI/backendAPI'
import {TextField, NumberField, SelectField, CheckboxField, getSelectedOptions} from '../../base/forms/forms'



export default function DeviceAdminPage(props) {
  const { device_id } = useParams();
  const [deviceParameters, setDeviceParameters] = useState({})
  const [deviceModbusParameters, setDeviceModbusParameters] = useState({})
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
    getDeviceTagsParameters(device_id, (data)=>{
      setDeviceTagsParameters(data)
      setLoading3(false)
    })
  }, [])
  
  const submitDeviceConfig = (device_parameters) => {
    postDeviceParameters(device_id, device_parameters, setDeviceParameters)
  }
  const submitModbusParameters = (modbus_parameters) => {
    postDeviceModbusParameters(device_id, modbus_parameters, setDeviceModbusParameters)
  }

  return (
    <React.Fragment>
      <h3 className='mb-3'>Настройка параметров прибора</h3>
      <div className='px-3 pb-3 pt-2 mx-1 my-0 bg-dark rounded text-light' style={{minHeight: 'calc(100vh - 135px)'}}>
        { loading1 || loading2 || loading3 ? 
          <div className='d-flex justify-content-center'><Loader /></div> 
          :
          <div>
            <DeviceStatusBar deviceParameters={deviceParameters} /> 
            <div className='row'>
              <div className='col-12 col-lg-6'>
                <DeviceConfigsForm deviceParameters={deviceParameters} submitDeviceConfig={submitDeviceConfig} />
                <p className='my-3 border-top border-secondary'></p>
                <DeviceModbusParametersForm deviceModbusParameters={deviceModbusParameters} submitModbusParameters={submitModbusParameters} />
              </div>
              <div className='col-12 col-lg-6 border-left border-secondary'>
                <p className='my-3 d-lg-none border-top border-secondary'></p>
                <TagsList deviceTagsParameters={deviceTagsParameters} device_id={device_id} />
              </div>
            </div>
          </div>
        }
      </div>
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
        <TextField titel={'Наименование прибора'} id={'name'} placeholder={'...'} value={parameters.name} onChange={handlNameChange}/>
        <NumberField titel={'Период опроса (сек)'} id={'polling_period'} placeholder={'...'} value={parameters.polling_period} min={1} onChange={handlPollingPeriodChange}/>
        <NumberField titel={'Таймаут соединения (сек)'} id={'timeout'} placeholder={'...'} value={parameters.timeout} onChange={handlTimeoutChange}/>
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
        <SelectField titel={'Протокол'} id={'protocol_type'} value={parameters.protocol_type} options={protocolTypeOptions} onChange={handlProtocolTypeChange} />
        <NumberField titel={'Адрес устройства'} id={'device_address'} value={parameters.device_address} min={1} max={247} onChange={handlDeviceAddressChange}/>
        <SelectField titel={'Скорость передачи данных'} id={'baudrate'} value={parameters.baudrate} options={baudrateOptions} onChange={handlBaudrateChange} />
        <SelectField titel={'Длинна адреса'} id={'address_size'} value={parameters.address_size} options={addressSizeOptions} onChange={handlAddressSizeChange} />
        <SelectField titel={'Контроль чётности'} id={'parity'} value={parameters.parity} options={parityOptions} onChange={handlParityChange} />
        <SelectField titel={'Количество стоп-битов'} id={'stopbit'} value={parameters.stopbit} options={stopBitOptions} onChange={handlStopbitChange} />
        <NumberField titel={'Таймаут запроса (мс)'} id={'packet_timout'} value={parameters.packet_timout} onChange={handlPacketTimoutChange}/>
        <NumberField titel={'Таймаут бита (мс)'} id={'bit_timout'} value={parameters.bit_timout} onChange={handlBitTimoutChange}/>
        <CheckboxField titel={'Младшим байтом вперед'} id={'lower_byte_forward'} checked={parameters.lower_byte_forward} onChange={handlLowerByteForwardChange}/>  
        <CheckboxField titel={'Младшим регистром вперед'} id={'lower_register_forward'} checked={parameters.lower_register_forward} onChange={handlLowerRegisterForwardChange}/>  
        <CheckboxField titel={'Разрешить групповое чтение'} id={'allow_group_reading'} checked={parameters.allow_group_reading} onChange={handlAllowGroupReadingChange}/>  

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
  
  return (
    <React.Fragment>
      <h5 className='text-info'>Теги прибора</h5>

      { tags.length > 0 ?
        <div className="table-responsive">
          <table className="table table-hover table-dark table-striped table-sm text-light w-100 mb-0">
            <thead> 
              <tr>
                <th className='border-0 text-secondary font-weight-bold pl-2'>№</th>
                <th className='border-0 text-secondary font-weight-bold'>Код параметра</th>
                <th className='border-0 text-secondary font-weight-bold'>Наименование параметра</th>
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
    history.push(`/device/${props.device_id}/admin/tags/${tag_id}/detail/`)
  }

  return (
    <tr className='table-row-like-link' onClick={()=> goToTagDetail(tag.id)}>
      <td className='border-0 text-secondary pl-2'> {props.index + 1} </td> 
      <td className='border-0'> {tag.code} </td>
      <td className='border-0'> {tag.name} </td>
      <td className='border-0'> {tag.value} </td>
    </tr>
  )
}


// import { useHistory } from "react-router-dom";

// const Table = () => {
//   ...
//   const history = useHistory();
//   const handleRowClick = (row) => {
//     history.push(`/use-cases/${row.original.id}`);
//   }  

//   return (
//     ...
//     <tr onClick={()=> handleRowClick(row)}}>
//       ...
//     </tr>
//     ...
//   );
// }


// ----------------------------------------------------------------------------------------------------------------------------
function DeviceStatusBar (props) {
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

