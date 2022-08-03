import React, { Component } from "react";
import {Link} from 'react-router-dom';

import axiosInstance from "../../backendAPI/axiosClient";

class Signup extends Component{
  constructor(props){
      super(props);
      this.state = {
          username: "",
          password: "",
          email:"",
          errors:{username:null, email:null, password:null}
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    try {
        const response = await axiosInstance.post('/user/create/', {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        });
        return response;
    } catch (error) {
        console.log(error.stack);
        this.setState({
          errors:error.response.data
        });           
    }
  }

  render() {
    const inputFieldClassName = 'form-control desk-bg-color-secondary-2 desk-border-color-primary desk-text-color-primary';
    return (
      <div className='desk-bg-color-primary desk-text-color-primary content-height'>  
        <div className='container card p-3 mt-5 desk-bg-color-secondary' style={{maxWidth: '500px'}}>
            <h2 className="desk-text-color-secondary">Регистрация</h2>              
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Имя пользователя:</label>
                <input name="username" type="text" className={inputFieldClassName} id="username" value={this.state.username} onChange={this.handleChange}/>
                { this.state.errors.username ? <span className='text-danger'>{this.state.errors.username}</span> : null}
              </div> 
              <div className="form-group">
                <label htmlFor="mail">Электронная почта:</label>
                <input name="email" type="email" className={inputFieldClassName} id="mail" value={this.state.email} onChange={this.handleChange}/>
                { this.state.errors.email ? <span className='text-danger'>{this.state.errors.email}</span> : null}
              </div> 
              <div className="form-group">
                <label htmlFor="pwd">Пароль:</label> 
                <input name="password" type="password" className={inputFieldClassName} id="pwd" value={this.state.password} onChange={this.handleChange}/>
                { this.state.errors.password ? <span className='text-danger'>{this.state.errors.password}</span> : null}
              </div> 
              <button type="submit" className="btn btn-outline-primary">Подтвердить</button>
              <div className="pt-3">
                <span className="pr-2 desk-text-color-secondary">Уже зарегестрированы?</span>
                <Link className="" to="/user/login/">Вход</Link>
              </div>
            </form>
        </div>
      </div>
    )
  }
}
export default Signup;