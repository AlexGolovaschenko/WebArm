import React from 'react' 
import {Link} from 'react-router-dom'


export default function WelcomePage() {
  const colors = [
    '#19CDD7', '#DDB27C', '#88572C', 
    '#FF991F', '#F15C17', '#223F9A', 
    '#DA70BF', '#125C77', '#4DC19C', 
    '#776E57', '#12939A', '#17B8BE', 
    '#F6D18A', '#B7885E', '#FFCB99', 
    '#F89570', '#829AE3', '#E79FD5', 
    '#1E96BE', '#89DAC1', '#B3AD9E'
  ]

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
            <div className='row py-5'>
              <div className='col-4 p-4' style={{backgroundColor: colors[19]}}>
                  <p><b>BFCloud</b> это сервис для удаленного мониторинга и управления 
                    промышленными и IoT устройствами Вашего предприятия 
                  </p>
                  <p> C <b>BFCloud</b> вы получаете:</p>
                  <ul>
                    <li>Мониоринг</li>
                    <li>Управление</li>
                    <li>Контроль аварийных событий</li>
                    <li>Уведомления о событиях на обьекте</li>
                    <li>Архивирование данных</li>
                    <li>И многое другое ...</li>
                  </ul>
              </div>
              <div className='col-4 p-4' style={{backgroundColor: colors[16]}}>
                  <h6>Простое подключение и настройка</h6>
                  <p> Все что нужно для подключения - установить модем для передачи данных 
                    и настроить конфигурацию опроса устройств в личном кабинете BFCloud
                  </p>
                  <h6>Открытый API</h6>
                  <p> Открытый RESTfull API сервиса позволяет интегрировать Ваши программные продукты и 
                    IoT устройства с BFCloud. Посредством API вы можите получать и передавать данные на сервер, 
                    выполнять управление устройствами, отправлять уведомления и многое другое. 
                  </p>                  
              </div>
              <div className='col-4 p-4' style={{backgroundColor: colors[19]}}>
                  <h6>Единый интерфейс для Персональных компьютеров и Мобильных устройств </h6>
                  <p> С BFCloud Вам не нужно устанавливать множество различных компьютерных и мобильных приложении 
                    для доступа к Вашему объекту. Все взаимодействие с сервисом происходит через адаптивный сайт.
                    Благодаря этому все что вам нужно для работы, это интернет-браузер и подключение к интернету. </p>
                  <br></br>
                  <h6><Link className='px-2' to="/device">Демо-версия: БУМП-14</Link></h6>    
              </div>                            
            </div>            
        </div>
      </div>
    </React.Fragment>
  );
}

 