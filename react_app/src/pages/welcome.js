import React from 'react' 
import {Link} from 'react-router-dom'


export default function WelcomePage() {

  return (
    <React.Fragment>
        <div className='p-3 w-100'>
            <div className='container text-center'>
                <h3 className='text-muted'>Добро пожаловать на <b>BFCloud</b></h3>
            </div>
            <br/>
            <div className='container text-center'>
                <p>Чтоб перейти к обзору подключенных устройств, кликните по ссылке ниже:</p>
                <Link to="/device/overview">Обзор БУМ-14</Link>
            </div>
        </div>
    </React.Fragment>
  );
}

 