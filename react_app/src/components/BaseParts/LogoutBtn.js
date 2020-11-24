import React, { Component } from "react";
import {Link} from 'react-router-dom'
import axiosInstance from "../../utils/axiosApi";


class LogoutBtn extends Component {
    constructor() {
        super();
        this.handleLogout = this.handleLogout.bind(this);
    }

    async handleLogout() {
      try {
          const response = await axiosInstance.post('/blacklist/', {
              "refresh_token": localStorage.getItem("refresh_token")
          });
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          axiosInstance.defaults.headers['Authorization'] = null;
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

export default LogoutBtn