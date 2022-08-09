import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";

import {getCompanyParameters, postCompanyParameters
  } from '../../backendAPI/backendAPI';
import Loader from '../../base/components/Loader';
import {TextField, ErrorMessage, FormContainer} from '../../base/forms/forms';


export default function CompanyDetailPage() {
  const [companyParams, setCompanyParams] = useState({});
  const [formErrors, setFormErrors] = useState(null);
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();

  useEffect(()=>{
    getCompanyParameters( response =>{
      setCompanyParams({'name': response.company.name});
      setLoading(false);
    });
  }, []);
  
  const submitCompanyParameters = (parameters) => {
    postCompanyParameters(parameters, (response)=>{ 
        setCompanyParams(response); setFormErrors(null);  
        history.push(`/company/overview/`);
      },
      (errors) => setFormErrors(errors)
    );
  }

  const cancelChanges = () => {history.push(`/company/overview/`)}
  
  return (
    <React.Fragment>
      { loading ? 
        <div className='d-flex justify-content-center'><Loader /></div> 
        :
        <FormContainer> 
          <CompanyDetailForm companyParameters={companyParams} formErrors={formErrors} 
            submitCompanyParameters={submitCompanyParameters} 
            cancelChanges={cancelChanges} 
          />
        </FormContainer> 
      }
    </React.Fragment>
  )
}


export function CompanyCreatePage() {
  const defaultParameters = {name: ''}
  const [formErrors, setFormErrors] = useState(null);
  const history = useHistory();
 
  const submitCompanyParameters = (parameters) => {
    postCompanyParameters(parameters, 
      (response)=>{history.push(`/company/overview/`);},
      (errors)=>{setFormErrors(errors);}
    );
  }

  const cancelChanges = () => {history.push(`/company/overview/`)}
  
  return (
    <FormContainer> 
      <CompanyDetailForm companyParameters={defaultParameters} formErrors={formErrors} 
        submitCompanyParameters={submitCompanyParameters} 
        cancelChanges={cancelChanges} 
      />
    </FormContainer>
  )
}



// ----------------------------------------------------------------------------------------------------------------------------
function CompanyDetailForm (props) {
  const [company, setCompany] = useState(props.companyParameters);
  const onSubmit = props.submitCompanyParameters;
  const onCancel = props.cancelChanges;
  const buttonsStyle = {minWidth: '150px'};

  const handlNameChange = (e) => { setCompany({...company, name: e.target.value}) };

  const handlSubmit = (e) => { 
    e.preventDefault();
    onSubmit(company);
  }

  return (
    <React.Fragment>
      <form onSubmit={handlSubmit}> 
        <h5 className='text-info text-center pt-3'>Параметры компании</h5>     
        <TextField titel={'Наименование'} id={'name'} value={company.name} onChange={handlNameChange}
          errors={props.formErrors ? props.formErrors.name : null}
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
        </div>
      </form>
    </React.Fragment>
  )
}
