import React from 'react'
import {NavLink} from 'react-router-dom'

export default function Sidebar() {
    return (
        <div className="col-2 m-0 p-0">
        <div className="bg-dark bg-color-pale-indigo p-3 h-100">

            <div className="nav flex-column nav-pills " id="v-pills-tab" role="tablist" aria-orientation="vertical">
                <NavLink className="nav-link" activeClassName="active" to="/device/overview">Обзор</NavLink>
                <NavLink className="nav-link" activeClassName="active" to="/device/settings">Настройки</NavLink>
                <NavLink className="nav-link" activeClassName="active" to="/device/graphs">Графики</NavLink>
                <NavLink className="nav-link" activeClassName="active" to="/device/events">Журнал</NavLink>
            </div>

        </div>
        </div>
    )
}