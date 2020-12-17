import React from 'react'
import {NavLink} from 'react-router-dom'

export default function Sidebar(props) {
    const {deviceId} = props

    return (
        <div className="col-2 m-0 p-0">
        <div className="bg-dark bg-color-gray p-2 h-100">
          <div className="p-1">

            <div className="nav flex-column nav-pills" style={{overflow: 'hidden'}} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <NavLink className="nav-link text-light btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="bg-dark" to={`/device/${deviceId}/overview/`}>
                  <div class="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-home' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Обзор</span>
                  </div>
                </NavLink>
                <NavLink className="nav-link text-light btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="bg-dark" to={`/device/${deviceId}/settings/`}>
                  <div class="d-inline-flex w-100 justify-content-center justify-content-lg-start ">
                    <i className='far fa-edit' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Настройки</span>
                  </div> 
                </NavLink>
                <NavLink className="nav-link text-light btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="bg-dark" to={`/device/${deviceId}/graphs/`}>
                  <div class="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='far fa-chart-bar' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Графики</span>
                  </div>
                </NavLink>
                <NavLink className="nav-link text-light btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="bg-dark" to={`/device/${deviceId}/events/`}> 
                  <div class="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='far fa-bell' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Журнал</span>
                  </div>
                </NavLink>
            </div>
            
          </div>
        </div>
        </div>
    )
}