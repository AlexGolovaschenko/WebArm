import React from 'react'

export default function Header() {
    return (
        <nav className="navbar navbar-expand-sm bg-dark navbar-dark bg-color-indigo header-height m-0">
            <a className="navbar-brand" href="#">WebArm</a>
            
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
            <li className="nav-item ml-auto">
                <a className="nav-link" href="#">Войти</a>
            </li>
            </ul> 
        </nav>       
    );
}