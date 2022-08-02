import React from 'react' 
import {Link} from 'react-router-dom'

import auth from '../../backendAPI/auth' 


function WelcomePage(props) {
  // const backgroundStyle = {
  //   backgroundImage: 'url("./img/grid.png")',
  //   backgroundRepeat: 'repeat-x',
  //   backgroundAttachment: 'fixed'
  // }


  function loginDemoUser() {
    const cb = ()=>{ props.history.push('/company/overview/') }
    auth.login('demo', 'DemoUserPassword', cb);
  }

  return (
    <React.Fragment>
      <div className='desk-color-primary text-light content-height'>
      <div className='card' style={{background:'none', border:'none'}}>
        <div className='container card my-5 p-3 w-100' style={{background:'rgba(30,30,30, 0.9)'}}>
            <div className='text-center pt-4'>
                <h3>Добро пожаловать на <b>CI Cloud</b></h3>
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
                  <h6> Вы можете воспользоваться  
                    <button type="button" className="btn btn-link px-2" href='#' onClick={loginDemoUser}>
                      демо-версией сервиса
                    </button>
                    для ознакомления
                  </h6> 
                </div>
              </div>
            </div>  

            <h5 className='pb-3 text-info text-center'>Список последних обновлений: </h5>
            <div className="card border-secondary mb-3" style={{background:'none'}}>
              <div className="card-body">
                <h6 className='text-primary'> Релиз Альфа 0.7 </h6> 
                <h6 className='text-success'> Доступна функция Жунала событий </h6> 
                <p className='text-info'> Теперь вы можите настраивать аварийные и другие события, 
                  облако будет автоматически контролировать условия их срабатывания.
                  При срабатывании условия события в Журнал будет записано соответствующее сообщение.
                </p> 
                <h6 className='text-success'> Доступна настройка параметров и тегов прибора </h6> 
                <p className='text-info'> Теперь в разделе Администрирование доступен
                подраздел Прибор, в котором собраны все настройки подключения прибора. 
                Так же в данном подразделе Вы можите настраивать и добавление Теги прибора.
                </p> 
              </div>
            </div>

            <div className="card border-secondary mb-3" style={{background:'none'}}>
              <div className="card-body">
                <h6 className='text-primary'> Релиз Альфа 0.6 </h6> 
                <h6 className='text-success'> Доступны Виджеты устройства </h6> 
                <p className='text-info'> Теперь в разделе Администрирование доступен
                подраздел Виджеты, в котором вы можите добавлять и настраивать виджеты, 
                для отображения информации об устройстве на странице Обзор.
                </p> 
              </div>
            </div>

        </div>
      </div>
      </div>
    </React.Fragment>
  );
}

export default WelcomePage