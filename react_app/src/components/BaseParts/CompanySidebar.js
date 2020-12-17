import React from 'react'
import {NavLink} from 'react-router-dom'

export default function Sidebar() {
    return (
        <div className="col-2 m-0 p-0">
        <div className="bg-dark bg-color-gray p-2 h-100">
          <div className="p-1">

            <div className="nav flex-column nav-pills" style={{overflow: 'hidden'}} id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <NavLink className="nav-link text-light btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="bg-dark" to="/company/overview/">
                  <div class="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-home' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Обзор</span>
                  </div>
                </NavLink>
                
                <NavLink className="nav-link text-light btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="bg-dark" to="/company/facilities/">
                  <div class="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-city' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Объекты</span>
                  </div> 
                </NavLink>
                
                <NavLink className="nav-link text-light btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="bg-dark" to="/company/employers/">
                  <div class="d-inline-flex w-100 justify-content-center justify-content-lg-start">
                    <i className='fas fa-users' style={{fontSize:'1.3em'}}></i>
                    <span className='pl-3 d-none d-lg-inline'>Сотрудники</span>
                  </div>
                </NavLink>

                <NavLink className="nav-link text-light btn" style={{outline: 'none', boxShadow: 'none'}} activeClassName="bg-dark" to="/company/profile/"> 
                  <div class="d-inline-flex w-100 justify-content-center justify-content-lg-start">
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