import React from 'react' 
import {Link} from 'react-router-dom'

import auth from '../../utils/auth' 


function WelcomePage(props) {
  // const backgroundStyle = {
  //   backgroundImage: 'url("./img/grid.png")',
  //   backgroundRepeat: 'repeat-x',
  //   backgroundAttachment: 'fixed'
  // }


  function loginDemoUser() {
    const cb = ()=>{ props.history.push('/company/overview/') }
    auth.login('admin', 'admin', cb );
  }

  return (
    <React.Fragment>
      <div className='bg-color-dark-gray text-light content-height'>
        <div className='container card mt-5 p-3 w-100' style={{background:'rgba(0,0,0,0.8)'}}>
            <div className='text-center pt-4'>
                <h3>Добро пожаловать на <b>BFCloud</b></h3>
            </div>
            <br/>
            <div className='text-center'>
                <h5>Для начала работы
                  <Link className='px-2' to="/user/login/">Войдите</Link>
                  или
                  <Link className='px-2' to="/user/registration/">Зарегистрируйтесь</Link>
                </h5>
            </div>

            <div className="card-columns py-5">
              <div className="card border-secondary" style={{background:'none'}}>
                <div className="card-body text-center">
                  <h6>Удаленный мониторинга и управления промышленными и IoT устройствами</h6>
                </div>
              </div>

              <div className="card border-secondary" style={{background:'none'}}>
                <div className="card-body text-center">
                  <h6>Контроль аварийных событий и уведомление о событиях на объекте </h6>
                </div>
              </div>

              <div className="card border-secondary" style={{background:'none'}}>
                <div className="card-body text-center">
                  <h6>Простое подключение и настройка опроса устройств</h6>
                </div>
              </div>

              <div className="card border-secondary" style={{background:'none'}}>
                <div className="card-body text-center">
                  <h6>Открытый API для интеграции с сторонним ПО и 
                    IoT устройствами 
                  </h6>
                </div>
              </div>  

              <div className="card border-secondary" style={{background:'none'}}>
                <div className="card-body text-center">
                  <h6>Единый интерфейс для Персональных компьютеров и Мобильных устройств </h6>
                </div>
              </div>

              <div className="card border-secondary" style={{background:'none'}}>
                <div className="card-body text-center">
                  <h6> Вы можете воспользоваться демо-версией сервиса 
                    <a className="px-2" href='#' onClick={loginDemoUser}>Демо-версия: БУМП-14</a>
                  </h6> 
                </div>
              </div>
            </div>            
        </div>
      </div>
    </React.Fragment>
  );
}

export default WelcomePage