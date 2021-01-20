import React, { useState } from 'react' 



export default function Toolbar(props) { 
  const [showRangeForm, setShowRangeForm] = useState(false)
  const [activeButton, setActiveButton] = useState([false, true, false, false, false, false, false, false])
  const changeGraphInterval = props.changeGraphInterval

  function toggleActiveButton(btn) {
    // enable selected button and off all other
    const b = activeButton.map( (item, index) => {
      return (index === btn) ? true : false
    })
    setActiveButton(b)
    // display form for range input 
    setShowRangeForm( (btn === 7) ? true : false ) 
  }

  function getActiveCalss(btn) {
    return activeButton[btn] ? ' active' : ''
  }

  return (
    <React.Fragment>
    <div className='d-flex justify-content-left p-0 pt-2 m-0'>
        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(0)} 
          onClick={()=>{
            toggleActiveButton(0)
            changeGraphInterval('5m', 'all')
          }}
        >онлайн</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(1)} 
          onClick={()=>{
            toggleActiveButton(1)
            changeGraphInterval('1h', '1m')
          }}
        >1 час</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(2)} 
          onClick={()=>{
            toggleActiveButton(2)
            changeGraphInterval('6h', '5m')
          }}
        >6 часов</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(3)} 
          onClick={()=>{
            toggleActiveButton(3)
            changeGraphInterval('12h', '10m')
          }}
        >12 часов</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(4)} 
          onClick={()=>{
            toggleActiveButton(4)
            changeGraphInterval('1d', '30m')
          }}
        >сутки</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(5)} 
          onClick={()=>{
            toggleActiveButton(5)
            changeGraphInterval('7d', '2h')
          }}
        >неделя</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(6)} 
          onClick={()=>{
            toggleActiveButton(6)
            changeGraphInterval('30d', '12h')
          }}
        >месяц</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(7)} 
          onClick={()=>{
            toggleActiveButton(7)
            changeGraphInterval('30d', '12h') // todo
          }}
        >интервал</button> 
    </div>

    {showRangeForm ? <RangeForm /> : null }
    </React.Fragment>
  );
}


function RangeForm(props) {
  return (
    <React.Fragment>
    <form className='pt-2'>
      <div className="input-group input-group-sm ">
        <div className="input-group-prepend ">
          <span className="input-group-text bg-secondary text-light border-secondary ml-1">C</span>
        </div>
        <input type="date" className="form-control bg-dark text-light border-secondary"></input>
        <input type="time" className="form-control bg-dark text-light border-secondary"></input>

        <div className="input-group-prepend ">
          <span className="input-group-text bg-secondary text-light border-secondary ml-2">По</span>
        </div>
        <input type="date" className="form-control bg-dark text-light border-secondary"></input>
        <input type="time" className="form-control bg-dark text-light border-secondary"></input>

        <button type="button" className='btn btn-sm btn-secondary ml-2 mr-1'>показать</button> <br/>
      </div>
    </form>
    </React.Fragment>
  );
}