import React, { Component } from "react";
import {Link} from 'react-router-dom';

import axiosInstance from "../../utils/axiosApi";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: "", password: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
          const response = await axiosInstance.post('user/token/obtain/', {
              username: this.state.username,
              password: this.state.password
          });
          axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
          localStorage.setItem('access_token', response.data.access);
          localStorage.setItem('refresh_token', response.data.refresh);
          window.location.href = '/device';
          return response;
        } catch (error) {
            throw error;
        }
    }

    render() {
        return (
            <div className='container p-3' style={{maxWidth: '500px'}}>
                <h2>Вход</h2>
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Пользователь:</label>
                    <input name="username" type="text" className="form-control" id="username" value={this.state.username} onChange={this.handleChange}/>
                  </div> 
                  <div className="form-group">
                    <label htmlFor="pwd">Пароль:</label> 
                    <input name="password" type="password" className="form-control" id="pwd" value={this.state.password} onChange={this.handleChange}/>
                  </div> 
                  <button type="submit" className="btn btn-outline-primary">Войти</button>
                  <div className="pt-3">
                    <span className="pr-2 text-secondary">Еще не зарегестрированы?</span>
                    <Link className="" to="/user/registration">Регистрация</Link>
                  </div>
                </form>
            </div>
        )
    }
}
export default Login;