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
    return (
    <div className='bg-color-dark-gray text-secondary content-height'>  
      <div className='container card p-3 mt-5 bg-dark' style={{maxWidth: '500px'}}>
        <h2>Вход</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Пользователь:</label>
            <input name="username" type="text" className="form-control bg-secondary border-secondary text-light" id="username" value={this.state.username} onChange={this.handleChange}/>
          </div> 
          <div className="form-group">
            <label htmlFor="pwd">Пароль:</label> 
            <input name="password" type="password" className="form-control bg-secondary border-secondary text-light" id="pwd" value={this.state.password} onChange={this.handleChange}/>
          </div> 
          <button type="submit" className="btn btn-outline-primary">Войти</button>
          <div className="pt-3">
            <span className="pr-2 text-secondary">Еще не зарегестрированы?</span>
            <Link className="" to="/user/registration/">Регистрация</Link>
          </div>
        </form>
      </div>
    </div>
    )
  }
}
export default Login;