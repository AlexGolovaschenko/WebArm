import React, { Component } from "react";
import {Link, withRouter} from 'react-router-dom'
import axiosInstance from "../../utils/axiosApi";

import auth from '../../utils/auth' 

class LogoutBtn extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout() {
      try {
          const response = await axiosInstance.post('user/token/blacklist/', {
              "refresh_token": localStorage.getItem("refresh_token")
          });
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          axiosInstance.defaults.headers['Authorization'] = null;
          auth.logout(()=>{
            this.props.history.push('/')
          });
          return response;
      }
      catch (e) {
          console.log(e);
      }
    };

    render() {
        return (
            <li className="nav-item" >
                <Link className="nav-link" to="" onClick={this.handleLogout}>Выйти</Link>
            </li>
        )
    };
};         

export default withRouter(LogoutBtn)