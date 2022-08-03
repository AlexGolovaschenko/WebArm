import React, { useEffect } from 'react' 
import {Link} from 'react-router-dom'

import axiosInstance from "../../backendAPI/axiosClient";
import getBaseUrl from '../../backendAPI/localSettings'
const BASE_URL = getBaseUrl()

function DeviceCard(props) {
    const [deviceData, setDeviceData] = React.useState({})
    const device = props.device   
   
    function readDeviceParameters() {
      axiosInstance.get(BASE_URL + "/device/parameters/", { params: { id: device.id }} )
        .then(responce => { 
            if (responce) {
                const deviceParameters = responce.data
                setDeviceData({...deviceParameters}) 
            }
        }) 
    }
    
    useEffect(() => {
      readDeviceParameters();
      const deviceParametersUpdateInterval = setInterval(readDeviceParameters, 5000);
      return () => {
        clearInterval(deviceParametersUpdateInterval);
      };
    }, [])


    return (
        <React.Fragment>
        <Link className="nav-link p-0 m-0" to={`/device/${device.id}/overview/`}>
            <div className='border rounded p-2 h-100 desk-bg-color-secondary desk-text-color-primary desk-border-color-primary card-hover' style={{overflow: 'hidden'}} >
                <h6 className='text-nowrap'>{device.name}</h6>
                <div className='p-0 m-0 small w-100'>
                    <table className="table table-sm p-0 m-0 desk-bg-color-secondary desk-text-color-primary desk-border-color-primary w-100">
                        <tbody>
                            <tr></tr>
                            <tr>
                                <td>Связь: </td>   
                                <td className='text-right'> {deviceData.is_online ? 
                                    <span className='desk-text-color-primary'>ОК</span> : 
                                    <span className='badge badge-pill badge-danger text-dark' style={{fontSize: '0.85em'}}>НЕТ</span> }
                                </td>
                            </tr> 
                            <tr>
                                <td>Обновлено: </td>   
                                <td className='text-right'> {deviceData.last_update ? 
                                    format_time(deviceData.last_update, (deviceData.is_online ? null : 'text-warning')) :
                                    <span className='desk-text-color-secondary'>никогда</span> } 
                                </td>
                            </tr>
                            <tr>
                                <td>Аварии: </td>   
                                <td className='text-right'> Нет  </td>
                            </tr>                                                         
                        </tbody>
                    </table>
                </div>
            </div>
        </Link>    
        </ React.Fragment> 
    )                   
}



function format_time (time, className='text-light') {
    const s = new Date(time)
    var yesterday = new Date()
    yesterday = yesterday.setDate(yesterday.getDate() - 1);
    if (s > yesterday) {
        let formatter = new Intl.DateTimeFormat([] , {hour: '2-digit', minute: '2-digit'});
        return <span className={className}>{formatter.format(s)}</span>
    } else {
        let formatter = new Intl.DateTimeFormat([] , {month: "short", day: "numeric" });
        return <span className={className}>{formatter.format(s)}</span>           
    }
}



export default DeviceCard
