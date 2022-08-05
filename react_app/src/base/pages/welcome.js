import React from 'react';
import {Link} from 'react-router-dom';

import auth from '../../backendAPI/auth';


export default function WelcomePage(props) {
  // const backgroundStyle = {
  //   backgroundImage: 'url("./img/grid.png")',
  //   backgroundRepeat: 'repeat-x',
  //   backgroundAttachment: 'fixed'
  // }
  function loginDemoUser() {
    const cb = ()=>{ props.history.push('/company/overview/') };
    auth.login('demo', 'DemoUserPassword', cb);
  };

  return (
    <React.Fragment>
      <div className='desk-bg-color-primary text-light content-height'>
      <div className='card' style={{background:'none', border:'none'}}>
        <div className='container card border-0 my-4 px-3 pt-3 pb-4 w-100' style={{background:'rgba(5,10,40, 0.3)'}}>
          <div className="card p-3" style={{background:'rgba(30,30,30, 0.9)'}}>
            <h3 className='text-center'>Добро пожаловать на <b>CI Cloud</b></h3>
            <h5 className='text-center text-secondary'>Для начала работы
              <Link className='px-2' to="/user/login/">Войдите</Link>
              или
              <Link className='px-2' to="/user/registration/">Зарегистрируйтесь</Link>
            </h5>
          </div>

          <div className="row equal px-1 py-5">
            <CardContainer>
              <h6>Удаленный мониторинга и управления промышленными и IoT устройствами</h6>
            </CardContainer>

            <CardContainer>
              <h6>Контроль аварийных событий и уведомление о событиях на объекте </h6>
            </CardContainer>

            <CardContainer>
              <h6>Простое подключение и настройка опроса устройств</h6>
            </CardContainer>

            <CardContainer>
              <h6>Открытый API для интеграции с сторонним ПО и IoT устройствами </h6>
            </CardContainer>

            <CardContainer>
              <h6>Единый интерфейс для Персональных компьютеров и Мобильных устройств </h6>
            </CardContainer>

            <CardContainer>
              <h6> Вы можете воспользоваться  
                <button type="button" className="btn btn-link px-2 py-0 m-0" onClick={loginDemoUser}>
                  демо-версией
                </button> для ознакомления
              </h6>
            </CardContainer>
          </div>  

          
          <UpdateDescriptionContainer>
            <h5 className='pb-3 text-secondary text-center'>Список последних обновлений: </h5>
            <UpdateDescriptionTitle> Обновление 0.1.7 </UpdateDescriptionTitle>
            <UpdateDescriptionHeader> Доступна функция Жунала событий </UpdateDescriptionHeader>
            <UpdateDescriptionMessage> 
              Теперь вы можите настраивать аварийные и другие события, 
              облако будет автоматически контролировать условия их срабатывания.
              При срабатывании условия события в Журнал будет записано соответствующее сообщение.
            </UpdateDescriptionMessage> 
            <UpdateDescriptionHeader> Доступна настройка параметров и тегов прибора </UpdateDescriptionHeader>
            <UpdateDescriptionMessage> 
              Теперь в разделе Администрирование доступен
              подраздел Прибор, в котором собраны все настройки подключения прибора. 
              Так же в данном подразделе Вы можите настраивать и добавление Теги прибора.
            </UpdateDescriptionMessage>  

            <UpdateDescriptionTitle> Обновление 0.1.6 </UpdateDescriptionTitle>
            <UpdateDescriptionHeader> Доступны Виджеты устройства </UpdateDescriptionHeader>
            <UpdateDescriptionMessage> 
              Теперь в разделе Администрирование доступен
              подраздел Виджеты, в котором вы можите добавлять и настраивать виджеты, 
              для отображения информации об устройстве на странице Обзор.
            </UpdateDescriptionMessage>  
          </UpdateDescriptionContainer>
        </div>
      </div>
      </div>
    </React.Fragment>
  );
}


function CardContainer (props) {
  return (
    <div className="col-4 p-2">
      <div className="card h-100 border-0" style={{background:'rgba(25,25,25, 0.9)'}}>
        <div className="card-body text-center text-info">
          {props.children}
        </div>
      </div>
    </div>
  )
}


function UpdateDescriptionContainer (props) {
  return (
    <div className="card border-0 mb-3" style={{background:'rgba(25,25,25, 0.9)'}}>
    <div className="card-body">
      {props.children}
    </div>
    </div>
  )
}

function UpdateDescriptionTitle (props) {
  return <h6 className='text-primary border-top border-info pt-3'> {props.children} </h6> 
}

function UpdateDescriptionHeader (props) {
  return <h6 className='text-success'> {props.children} </h6> 
}

function UpdateDescriptionMessage (props) {
  return <p className='text-info'> {props.children} </p> 
}