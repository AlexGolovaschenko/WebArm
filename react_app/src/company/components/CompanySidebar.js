import React from 'react'
import {NavLink} from 'react-router-dom'

export default function Sidebar() {
    return (
        <div className="col-2 m-0 p-0">
        <div className="sidebar-color-primary p-2 h-100">
          <div className="p-1">

            <div className="nav flex-column nav-pills" style={{overflow: 'hidden'}} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <NavLink className="nav-link sidebar-text-color-primary btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="sidebar-color-secondary" to="/company/overview/">
                  <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-home' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Обзор</span>
                  </div>
                </NavLink>
                
                <NavLink className="nav-link sidebar-text-color-primary btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="sidebar-color-secondary" to="/company/map/">
                  <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-map-marked-alt' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Карта</span>
                  </div> 
                </NavLink>
                
                <NavLink className="nav-link sidebar-text-color-primary btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="sidebar-color-secondary" to="/company/employers/">
                  <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-users' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Сотрудники</span>
                  </div>
                </NavLink>

                <NavLink className="nav-link sidebar-text-color-primary btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="sidebar-color-secondary" to="/company/profile/"> 
                  <div className="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-chalkboard-teacher' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Кабинет</span>
                  </div>
                </NavLink>
            </div>
            
          </div>
        </div>
        </div>
    )
}