import React, { useState } from 'react' 



export default function Toolbar(props) { 
  const [showRangeForm, setShowRangeForm] = useState(false)
  const [activeButton, setActiveButton] = useState([true, false, false, false, false, false, false, false, false, false])
  const toggleModal = props.toggleModal
  const toggleCroshair = props.toggleCroshair

  function toggleActiveButton(btn) {
    setActiveButton( (prev) => {
      return prev.map( (item, index) => {
        if (btn > 7) {
          return index === btn ? !item : item
        } else {
          var r = item
          r = (index === btn) ? true : 
            (index < 8) ? false : item
          if (index === 7) {setShowRangeForm(r)}
          return r
        }
      } )
    } ) 
  }

  function getActiveCalss(btn) {
    return activeButton[btn] ? ' active' : ''
  }
  
  function onClickFullScreenButton() {
    toggleActiveButton(9)
    toggleModal()
  }

  function onClickCroshairButton() {
    toggleActiveButton(8)
    toggleCroshair()
  }

  return (
    <React.Fragment>
    <div className='d-flex justify-content-left p-0 pt-2 m-0'>
        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(0)} 
          onClick={()=>{toggleActiveButton(0)}}
        >онлайн</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(1)} 
          onClick={()=>{toggleActiveButton(1)}}
        >1 час</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(2)} 
          onClick={()=>{toggleActiveButton(2)}}
        >6 часов</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(3)} 
          onClick={()=>{toggleActiveButton(3)}}
        >12 часов</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(4)} 
          onClick={()=>{toggleActiveButton(4)}}
        >сутки</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(5)} 
          onClick={()=>{toggleActiveButton(5)}}
        >неделя</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(6)} 
          onClick={()=>{toggleActiveButton(6)}}
        >месяц</button>

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ' + getActiveCalss(7)} 
          onClick={()=>{toggleActiveButton(7)}}
        >интервал</button> 

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 ml-auto fas fa-ruler-vertical ' + getActiveCalss(8)} 
          style={{minWidth: '34px', fontSize:'1.1em'}}
          onClick={onClickCroshairButton}
        ></button> 

        <button type="button" 
          className={'btn btn-sm btn-outline-secondary mx-1 fas fa-expand-arrows-alt ' + getActiveCalss(9)} 
          style={{minWidth: '34px', fontSize:'1.1em'}} 
          onClick={onClickFullScreenButton}
        ></button> 
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