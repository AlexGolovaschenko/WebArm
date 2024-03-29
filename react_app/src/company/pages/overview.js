import React, { useEffect, useState } from 'react';
import {useHistory} from "react-router-dom";

import Loader from '../../base/components/Loader';
import FacilityCard from '../components/FacilityCard';
import {getCompanyParameters} from '../../backendAPI/backendAPI';


export default function CompanyOverviewPage() {
  const [companyInfo, setCompanyInfo] = useState({});
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();

  useEffect(()=>{
    getCompanyParameters( 
      (response) => {setCompanyInfo({'isExist': true, ...response});},
      (error) => {setCompanyInfo({'isExist': false}); console.log(error);},
      () => {setLoading(false);}
    );
  }, []);

  const editCompany = () => {
    companyInfo.isExist ? history.push(`/company/detail`) : history.push(`/company/create`);
  };

  return (
    <React.Fragment>
      <h3 className='p-1'>
        Компания <b>{ (!loading && companyInfo.isExist) ? 
          companyInfo.company.name : 
          null}
        </b>
        <button type='button' className='btn btn-sm desk-text-color-secondary card-hover float-right' 
                onClick={editCompany}>
          <i className='fas fa-pen' style={{fontSize:'1.3em'}}></i>
        </button>
      </h3>
      
      <div className='container-fluid row p-0 m-0'>
        { loading ? <Loader /> 
        : companyInfo.isExist ? <CompanyOverviewBlock companyInfo={companyInfo}/> 
          : <CompanyDoesntExistBlock /> 
        }
      </div>
    </React.Fragment>
  );
}


function CompanyOverviewBlock(props) {
  const hasFacilities = props.companyInfo.facilities.length > 0;
  return ( hasFacilities ? 
    <FacilityOverviewBlock companyInfo={props.companyInfo}/> : 
    <FacilityDoesntExistBlock />
  );
}

function CompanyDoesntExistBlock(props) {
  const history = useHistory();
  const createNewCompany = () => {history.push(`/company/create`)}
  return (
    <React.Fragment>
      <div className='container-fluid px-2'>
        <p className='text-warning'>У вас еще нет зарегестрированной компании</p>
        <button type='button' className='btn btn-outline-warning' 
                onClick={createNewCompany}>
          Зарегистировать
        </button>
      </div>
    </React.Fragment>
  );
}


function FacilityOverviewBlock(props) {
  return (
    <React.Fragment>
      { props.companyInfo.facilities.map((facility, index) => {
        return (
          <div key={facility.id} className='container-fluid p-1 m-0 col-xl-6'>
            <FacilityCard facilityInfo={facility} index={index}/>
          </div>
        )
      }) }        
    </React.Fragment>
  );
}

function FacilityDoesntExistBlock() {
  return (
    <React.Fragment>
      <div className='container-fluid px-2'>
        <p className='text-warning'>У вас еще нет объектов для мониторинга</p>
        <button type='button' className='btn btn-outline-warning'
                onClick={()=>alert('Данная функция еще находится в разработке.')}>
          Добавить
        </button>
      </div>        
    </React.Fragment>
  );
}


