import React, { Component } from "react";
import {Link} from 'react-router-dom';

import auth from '../../backendAPI/auth' 


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

  handleSubmit(event) {
    event.preventDefault();
    const cb = ()=>{ this.props.history.push('/company/overview/') }
    auth.login(this.state.username, this.state.password, cb );
  }

  render() {
    const inputFieldClassName = 'form-control desk-bg-color-secondary-2 desk-border-color-primary desk-text-color-primary';
    return (
    <div className='desk-bg-color-primary desk-text-color-primary content-height'>  
      <div className='container card p-3 mt-5 desk-bg-color-secondary' style={{maxWidth: '500px'}}>
        <h2 className="desk-text-color-secondary">Вход</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Пользователь:</label>
            <input name="username" type="text" className={inputFieldClassName} id="username" value={this.state.username} onChange={this.handleChange}/>
          </div> 
          <div className="form-group">
            <label htmlFor="pwd">Пароль:</label> 
            <input name="password" type="password" className={inputFieldClassName} id="pwd" value={this.state.password} onChange={this.handleChange}/>
          </div> 
          <button type="submit" className="btn btn-outline-primary">Войти</button>
          <div className="pt-3">
            <span className="pr-2 desk-text-color-secondary">Еще не зарегестрированы?</span>
            <Link className="" to="/user/registration/">Регистрация</Link>
          </div>
        </form>
      </div>
    </div>
    )
  }
}

export default Login;