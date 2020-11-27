import React from 'react';
import {Link} from 'react-router-dom'


function DeviceCard(props) {
    const device = props.device   

    return (
        <React.Fragment>
        <Link className="nav-link p-0 m-0" to={`/device/${device.id}/overview/`}>
            <div className='border border-secondary rounded p-2 h-100 bg-dark text-light card-hover' >
                <h6 className=''>{device.name}</h6>
                <div className='p-0 m-0 small w-100'>
                    <table className="table table-sm p-0 m-0 table-dark text-light w-100">
                        <tbody>
                            <tr>
                                <td> Связь: </td>   
                                <td className='text-right'> ОК </td>
                            </tr> 
                            <tr>
                                <td>  Обновлено: </td>   
                                <td className='text-right'> 16:08 </td>
                            </tr>
                            <tr>
                                <td>   Аварии: </td>   
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

export default DeviceCard