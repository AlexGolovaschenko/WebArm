import React from 'react'
import {Link} from 'react-router-dom'

import LogoutBtn from './LogoutBtn'

export default function Navbar(props) {
    const authed = props.authed
    const userInfo = props.userInfo
    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark bg-color-indigo header-height m-0">
            <Link className="navbar-brand" to="/">WebArm</Link>

            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" href="#">Предприятие</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Обьекты</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Кабинет</a>
                </li>
            </ul>  
    
            <ul className="navbar-nav ml-auto">
                {authed ? (
                    <React.Fragment>
                        { userInfo ?
                            <React.Fragment> 
                                <li className="nav-item">
                                    <Link className="nav-link" to="/user/profile">{userInfo.username}</Link>
                                </li>
                                <li className="nav-item border-right border-secondary my-1"> </li>
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
        </nav>       
    );
}