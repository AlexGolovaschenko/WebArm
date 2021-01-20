import React, { useEffect, useState } from 'react' 

import Loader from '../../base/components/Loader'
import FacilityCard from '../components/FacilityCard'
import axiosInstance from "../../utils/axiosApi";
import getBaseUrl from '../../utils/localSettings'
const BASE_URL = getBaseUrl()



export default function CompanyOverviewPage() {
  const [companyInfo, setCompanyInfo] = useState({})
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    readCompanyInfo( (inf)=> {
      setCompanyInfo(inf);
      setLoading(false);
    });   
  }, [])  

  return (
    <React.Fragment>
      <h3 className='px-3 pt-3 pb-0'>Предприятие <b>{loading ? null : companyInfo.company.name}</b></h3>

      <div className='container-fluid py-0 px-2 m-0 row'>
        {loading ? <Loader /> : 
          <React.Fragment>
            { companyInfo.facilities.map((facility, index) => {
                return (
                  <div key={facility.id} className='container-fluid px-2 py-0 mx-0 my-2 col-xl-6'>
                    <FacilityCard facilityInfo={facility} index={index}/>
                  </div>
                )
            }) }       
          </React.Fragment>
        }
      </div>
    </React.Fragment>
  );
}


async function readCompanyInfo(cb) {
  const request = await axiosInstance.get(BASE_URL + "/company/info/")
  cb({...request.data});
}
 