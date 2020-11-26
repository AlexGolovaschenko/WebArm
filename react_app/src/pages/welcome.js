import React from 'react' 
import {Link} from 'react-router-dom'


export default function WelcomePage() {
  const backgroundStyle = {
    backgroundImage: 'url("./img/grid.png")',
    backgroundRepeat: 'repeat-x',
    backgroundAttachment: 'fixed'
  }

  return (
    <React.Fragment>
      <div style={backgroundStyle}>
        <div className='p-3 w-100 container'>
            <div className='text-center pt-5'>
                <h3 className='text-muted'>Добро пожаловать на <b>BFCloud</b></h3>
            </div>
            <br/>
            <div className='text-center'>
                <h5>Для начала работы
                  <Link className='px-2' to="/user/login">Войдите</Link>
                  или
                  <Link className='px-2' to="/user/registration">Зарегистрируйтесь</Link>
                </h5>
            </div>

            <div className="card-columns py-5">
              <div className="card bg-primary">
                <div className="card-body text-center">
                  <h6>Удаленный мониторинга и управления промышленными и IoT устройствами</h6>
                </div>
              </div>

              <div className="card bg-info">
                <div className="card-body text-center">
                  <h6>Контроль аварийных событий и уведомление о событиях на объекте </h6>
                </div>
              </div>

              <div className="card bg-success">
                <div className="card-body text-center">
                  <h6>Простое подключение и настройка опроса устройств</h6>
                </div>
              </div>

              <div className="card bg-danger">
                <div className="card-body text-center">
                  <h6>Открытый API для интеграции с сторонним ПО и 
                    IoT устройствами 
                  </h6>
                </div>
              </div>  

              <div className="card bg-secondary">
                <div className="card-body text-center">
                  <h6>Единый интерфейс для Персональных компьютеров и Мобильных устройств </h6>
                </div>
              </div>

              <div className="card bg-warning">
                <div className="card-body text-center">
                  <h6> Вы можете воспользоваться демо-версией сервиса 
                    <Link className="px-2" to="/device">Демо-версия: БУМП-14</Link>
                  </h6> 
                </div>
              </div>
            </div>            
        </div>
      </div>
    </React.Fragment>
  );
}

 