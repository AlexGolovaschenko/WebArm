import React from 'react'
import {NavLink} from 'react-router-dom'

export default function Sidebar(props) {
  const [displaySubMenu, setDisplaySubMenu] = React.useState(false)
  const {deviceId} = props

  const styleBtnRemoveOutline = {outline: 'none', boxShadow: 'none'}

  return (
    <div className="col-2 m-0 p-0">
      <div className="bg-dark bg-color-gray p-2 h-100">
        <div className="p-1">

          <div className="nav flex-column nav-pills" style={{overflow: 'hidden'}} id="v-pills-tab" role="tablist" aria-orientation="vertical">
              <NavLink className="nav-link text-light btn" style={styleBtnRemoveOutline} activeClassName="bg-dark" to={`/device/${deviceId}/overview/`}>
                <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                  <i className='fas fa-home' style={{fontSize:'1.3em'}}></i>
                  <span className='pl-3 d-none d-lg-inline text-left'>Обзор</span>
                </div>
              </NavLink>
              <NavLink className="nav-link text-light btn" style={styleBtnRemoveOutline} activeClassName="bg-dark" to={`/device/${deviceId}/settings/`}>
                <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start ">
                  <i className='far fa-edit' style={{fontSize:'1.3em'}}></i>
                  <span className='pl-3 d-none d-lg-inline text-left'>Настройки</span>
                </div> 
              </NavLink>
              <NavLink className="nav-link text-light btn" style={styleBtnRemoveOutline} activeClassName="bg-dark" to={`/device/${deviceId}/graphs/`}>
                <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                  <i className='far fa-chart-bar' style={{fontSize:'1.3em'}}></i>
                  <span className='pl-3 d-none d-lg-inline text-left'>Графики</span>
                </div>
              </NavLink>
              <NavLink className="nav-link text-light btn" style={styleBtnRemoveOutline} activeClassName="bg-dark" to={`/device/${deviceId}/events/`}> 
                <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                  <i className='far fa-bell' style={{fontSize:'1.3em'}}></i>
                  <span className='pl-3 d-none d-lg-inline text-left'>Журнал</span>
                </div>
              </NavLink>
            </div>


            <div className="nav flex-column nav-pills" style={{overflow: 'hidden'}} >              
              <div className='border-top mt-3 pt-3 border-secondary'></div>
              <button className="nav-link text-light btn" style={styleBtnRemoveOutline} onClick={()=>{setDisplaySubMenu(!displaySubMenu)}}>
                <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                  <i className='	fas fa-list py-1' style={{fontSize:'1.3em'}}></i>
                  <span className='pl-3 d-none d-lg-inline text-left'>Администрирование</span>
                  <i className='fas fa-caret-down py-1 pl-1 ml-auto d-none d-lg-inline' ></i>
                </div>
              </button>

              {displaySubMenu && <React.Fragment>
                <NavLink className="nav-link text-light btn" style={styleBtnRemoveOutline} activeClassName="bg-dark" to={`/device/${deviceId}/admin/config/`}> 
                  <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-circle px-1 pt-2' style={{fontSize:'0.6em'}}></i>
                    <span className='pl-3 d-none d-lg-inline text-left'>Прибор</span>
                  </div>
                </NavLink>

                <NavLink className="nav-link text-light btn" style={styleBtnRemoveOutline} activeClassName="bg-dark" to={`/device/${deviceId}/admin/widgets/`}> 
                  <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-circle px-1 pt-2' style={{fontSize:'0.6em'}}></i>
                    <span className='pl-3 d-none d-lg-inline text-left'>Виджеты</span>
                  </div>
                </NavLink>
              </React.Fragment> }
          </div>
          
        </div>
      </div>
    </div>
  )
}