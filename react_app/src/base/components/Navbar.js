import React from 'react'
import {Link} from 'react-router-dom'

import LogoutBtn from '../../users/components/LogoutBtn'

export default function Navbar(props) {
    const authed = props.authed
    const userInfo = props.userInfo
    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark bg-color-indigo header-height p-0 m-0">
            <Link className="navbar-brand header-height py-2 pl-3 pr-0 m-0" to="/">WebArm</Link>

            <button className="navbar-toggler header-height border-0 m-0" style={{outline: 'none', boxShadow: 'none'}} type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse bg-color-indigo" id="collapsibleNavbar" style={{zIndex: '1'}}>
                <div className='d-md-none border-top border-secondary'></div>
                <ul className="navbar-nav px-3">
                    {authed ? (
                        <React.Fragment>
                            <li className="nav-item">
                                <Link className="nav-link" to="/company/overview">Предприятие</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/company/facilities">Обьекты</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/company/profile">Кабинет</Link>
                            </li>
                        </React.Fragment>
                    ) : null }
                </ul>  
        
                <ul className="navbar-nav ml-auto px-3">
                    {authed ? (
                        <React.Fragment>
                            { userInfo ?
                                <React.Fragment> 
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/user/profile">{userInfo.username}</Link>
                                    </li>
                                    <li className="nav-item border-right border-secondary my-1 d-none d-sm-inline"> </li>
                                </React.Fragment>                        
                            : null }
                            <LogoutBtn />
                        </React.Fragment>
                    ) : (
                        <li className="nav-item">
                            <Link className="nav-link" to="/user/login">Войти</Link>
                        </li>
                    )}
                </ul> 
            </div>
        </nav>       
    );
}