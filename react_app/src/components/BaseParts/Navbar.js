import React from 'react'
import {Link, Route} from 'react-router-dom'

import LogoutBtn from './LogoutBtn'


export default function Navbar() {
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
                <li className="nav-item">
                    <Link className="nav-link" to="/user/login">Войти</Link>
                </li>
                <LogoutBtn />
            </ul> 
        </nav>       
    );
}