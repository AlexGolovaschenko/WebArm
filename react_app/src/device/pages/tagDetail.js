import React, {useState, useEffect} from 'react';
import { useHistory, useParams } from "react-router-dom";

import Loader from '../../base/components/Loader';
import {getDeviceTagsParameters, postDeviceTagsParameters, deleteDeviceTags,
} from '../../backendAPI/backendAPI';

import {TextField, NumberField, SelectField, getSelectedOptions, ErrorMessage, 
  FormContainer
} from '../../base/forms/forms';



export default function TagDetailPage() {
  const { tag_id, device_id } = useParams();
  const [tagParameters, setTagParameters] = useState({});
  const [formErrors, setFormErrors] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();

  useEffect(()=>{
    getDeviceTagsParameters(device_id, [tag_id], (data)=>{
      setTagParameters(data[0])
      setLoading(false)
    })
  }, []);
  
  const submitTagParameters = (tag_parameters) => {
    postDeviceTagsParameters(device_id, [tag_parameters], 
      (responce_data)=>{ 
        setTagParameters(responce_data[0]); setFormErrors(null);  
        history.push(`/device/${device_id}/admin/config/`);
      },
      (errors_data)=>{ setFormErrors(errors_data[0]) }
    )
  };

  const cancelChanges = () => { 
    history.push(`/device/${device_id}/admin/config/`)
  };

  const deleteTag = () => { 
    deleteDeviceTags(device_id, [tag_id], 
      () => history.push(`/device/${device_id}/admin/config/`)
    )
  };
  
  return (
    <React.Fragment>
      { loading ? 
        <div className='d-flex justify-content-center'><Loader /></div> 
        :
        <FormContainer> 
          <TagDetailForm tagParameters={tagParameters} formErrors={formErrors} 
            submitTagParameters={submitTagParameters} 
            cancelChanges={cancelChanges} 
            deleteTag={deleteTag} 
          />
        </FormContainer> 
      }
    </React.Fragment>
  )
}



export function TagCreatePage() {
  const { device_id } = useParams();
  const history = useHistory()
  const defaultTagParameters = { 
    code: '', name: '', data_type: 'INT',
    modbus_parameters: {data_type: 'INT', register_address: 0, read_function: '3', write_function: '6'}
  }
  const [formErrors, setFormErrors] = useState({})

  const submitTagParameters = (tag_parameters) => {
    postDeviceTagsParameters(device_id, [tag_parameters], 
      ()=>{ history.push(`/device/${device_id}/admin/config/`) },
      (errors_data)=>{ setFormErrors(errors_data[0]) }
    )
  }

  const cancelChanges = () => { 
    history.push(`/device/${device_id}/admin/config/`)
  }
  
  return (
    <FormContainer> 
      <TagDetailForm tagParameters={defaultTagParameters} formErrors={formErrors} 
        submitTagParameters={submitTagParameters} 
        cancelChanges={cancelChanges} 
      />
    </FormContainer>
  )
}



// ----------------------------------------------------------------------------------------------------------------------------
function TagDetailForm (props) {
  const [tag, setTag] = useState(props.tagParameters)
  const onSubmit = props.submitTagParameters
  const onCancel = props.cancelChanges
  const onDelete = props.deleteTag
  const buttonsStyle = {minWidth: '150px'}

  const serverDataTypeOptions = [    
    {value: 'INT',    name:'INT'}, 
    {value: 'FLOAT',  name:'FLOAT'}, 
    {value: 'STRING', name:'STRING'},
    {value: 'BOOL',   name:'BOOL'}
  ]
  const modbusDataTypeOptions = [    
    {value: 'WORD',   name:'WORD'}, 
    {value: 'INT',    name:'INT'}, 
    {value: 'UINT',   name:'UINT'}, 
    {value: 'FLOAT',  name:'FLOAT'}, 
    {value: 'STRING', name:'STRING'},
    {value: 'BOOL',   name:'BOOL'}
  ]
  const modbusReadFunctionOptions = [    
    {value: '1',  name:'1 - Read Coil'}, 
    {value: '2',  name:'2 - Read Discrete Input'}, 
    {value: '3',  name:'3 - Read Holding Registers'}, 
    {value: '4',  name:'4 - Read Input Registers'}
  ]
  const modbusWriteFunctionOptions = [    
    {value: '5',   name:'5 - Write Single Coil'}, 
    {value: '6',   name:'6 - Write Single Holding Register'}, 
    {value: '15',  name:'15 - Write Multiple Coils'}, 
    {value: '16',  name:'16 - Write Multiple Holding Registers'}
  ]

  const handlCodeChange = (e) => { setTag({...tag, code: e.target.value}) }
  const handlNameChange = (e) => { setTag({...tag, name: e.target.value}) }
  const handlDataTypeChange = (e) => { setTag({...tag, data_type: getSelectedOptions(e)[0]}) }
  const handlModbusDataTypeChange = (e) => { setTag({
    ...tag, modbus_parameters: {...tag.modbus_parameters, data_type: getSelectedOptions(e)[0] } 
  })}
  const handlModbusRegisterAddressChange = (e) => { setTag({
    ...tag, modbus_parameters: {...tag.modbus_parameters, register_address: e.target.value } 
  })}
  const handlModbusReadFunctionChange = (e) => { setTag({
    ...tag, modbus_parameters: {...tag.modbus_parameters, read_function: getSelectedOptions(e)[0] } 
  })}
  const handlModbusWriteFunctionChange = (e) => { setTag({
    ...tag, 
    modbus_parameters: {...tag.modbus_parameters, write_function: getSelectedOptions(e)[0] } 
  })}

  const handlSubmit = (e) => { 
    e.preventDefault();
    onSubmit(tag);
  }

  return (
    <React.Fragment>
      <form onSubmit={handlSubmit}> 
        <h5 className='text-info text-center'>Параметры тега</h5>     
        <TextField titel={'Код'} id={'code'} value={tag.code} onChange={handlCodeChange} 
          errors={props.formErrors ? props.formErrors.code : null}
        />  
        <TextField titel={'Наименование'} id={'name'} value={tag.name} onChange={handlNameChange}
          errors={props.formErrors ? props.formErrors.name : null}
        />
        <SelectField titel={'Тип данных на сервере'} id={'data_type'} value={tag.data_type} options={serverDataTypeOptions} onChange={handlDataTypeChange} 
          errors={props.formErrors ? props.formErrors.data_type : null}
        />

        <h5 className='text-info text-center'>Параметры Modbus</h5>
        <SelectField titel={'Тип данных в устройстве'} id={'modbus_data_type'} value={tag.modbus_parameters ? tag.modbus_parameters.data_type : null} 
          options={modbusDataTypeOptions} onChange={handlModbusDataTypeChange} 
          errors={props.formErrors && props.formErrors.modbus_parameters ? props.formErrors.modbus_parameters.data_type : null}
        />
        <NumberField titel={'Адрес регистра'} id={'modbus_register_address'} value={tag.modbus_parameters ? tag.modbus_parameters.register_address : null } 
          onChange={handlModbusRegisterAddressChange}
          errors={props.formErrors && props.formErrors.modbus_parameters ? props.formErrors.modbus_parameters.register_address : null}
        />
        <SelectField titel={'Функиця чтения'} id={'modbus_read_function'} value={tag.modbus_parameters ? tag.modbus_parameters.read_function : null} 
          options={modbusReadFunctionOptions} onChange={handlModbusReadFunctionChange} 
          errors={props.formErrors && props.formErrors.modbus_parameters ? props.formErrors.modbus_parameters.read_function : null}
        />
        <SelectField titel={'Функиця записи'} id={'modbus_write_function'} value={tag.modbus_parameters ? tag.modbus_parameters.write_function : null} 
          options={modbusWriteFunctionOptions} onChange={handlModbusWriteFunctionChange} 
          errors={props.formErrors && props.formErrors.modbus_parameters ? props.formErrors.modbus_parameters.write_function : null}  
        />

        <ErrorMessage>
          {props.formErrors && props.formErrors.non_field_errors ? 
            <div className='card bg-danger text-dark my-3 p-2'> {props.formErrors.non_field_errors}</div>
            : null
          }
        </ErrorMessage>


        <div className='d-flex flex-wrap justify-content-center'>
          <button type="submit" className="btn btn-outline-primary m-2" style={buttonsStyle}>Сохранить</button>
          <button type="button" className="btn btn-outline-secondary m-2" style={buttonsStyle} onClick={onCancel}>Отмена</button>
          { props.deleteTag && <button type="button" className="btn btn-outline-danger m-2" style={buttonsStyle} onClick={onDelete}>Удалить</button> }
        </div>
      </form>
    </React.Fragment>
  )
}
