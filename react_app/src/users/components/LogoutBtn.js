import React, { Component } from "react";
import {Link, withRouter} from 'react-router-dom'

import auth from '../../backendAPI/auth' 

class LogoutBtn extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        auth.logout(()=>{
            this.props.history.push('/')
        });
    };

    render() {
        return (
            <li className="nav-item" >
                <Link className="nav-link navbar-text-color-primary" to="" onClick={this.handleLogout}>Выйти</Link>
            </li>
        )
    };
};         

export default withRouter(LogoutBtn)