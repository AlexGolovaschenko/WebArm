import React, { useEffect, useState } from 'react' 

import Loader from '../../base/components/Loader'
import FacilityCard from '../components/FacilityCard'
import axiosInstance from "../../backendAPI/axiosApi";
import getBaseUrl from '../../backendAPI/localSettings'

const BASE_URL = getBaseUrl()


async function readCompanyInfo(cb) {
  await axiosInstance.get(
      BASE_URL + "/company/info/"
    ).then(response => {
      cb({'isExist': true, ...response.data});
    }).catch(e => {
      console.log(e);
      cb({'isExist': false});
    });
}


export default function CompanyOverviewPage() {
  const [companyInfo, setCompanyInfo] = useState({})
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    readCompanyInfo(inf => {
      setCompanyInfo(inf);
      setLoading(false);
    });   
  }, []);

  return (
    <React.Fragment>
      <h3 className='px-3 pt-3 pb-0'>Компания <b>
        {(!loading && companyInfo.isExist) ? companyInfo.company.name : null}
      </b></h3>
      <div className='container-fluid py-0 px-2 m-0 row'>
        { loading ? 
          <Loader /> : 
          companyInfo.isExist ? 
            <CompanyOverviewBlock companyInfo={companyInfo}/> : 
            <CompanyDoesntExistBlock />  
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
  return (
    <React.Fragment>
      <div className='container-fluid px-2'>
        <p className='text-warning'>У вас еще нет зарегестрированной компании</p>
        <button type='button' className='btn btn-outline-warning' 
                onClick={()=>alert('Данная функция еще находится в разработке.')}>
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
          <div key={facility.id} className='container-fluid px-2 py-0 mx-0 my-2 col-xl-6'>
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


