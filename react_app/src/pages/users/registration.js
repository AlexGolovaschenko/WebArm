import React, { Component } from "react";
import {Link} from 'react-router-dom'

import axiosInstance from "../../utils/axiosApi";

class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            email:"",
            setAuthed: props.user.setAuthed,            
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
        return (
            <div className='container p-3' style={{maxWidth: '500px'}}>
                <h2>Регистрация</h2>              
                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="username">Имя пользователя:</label>
                    <input name="username" type="text" className="form-control" id="username" value={this.state.username} onChange={this.handleChange}/>
                    { this.state.errors.username ? this.state.errors.username : null}
                  </div> 
                  <div className="form-group">
                    <label htmlFor="mail">Электронная почта:</label>
                    <input name="email" type="email" className="form-control" id="mail" value={this.state.email} onChange={this.handleChange}/>
                    { this.state.errors.email ? this.state.errors.email : null}
                  </div> 
                  <div className="form-group">
                    <label htmlFor="pwd">Пароль:</label> 
                    <input name="password" type="password" className="form-control" id="pwd" value={this.state.password} onChange={this.handleChange}/>
                    { this.state.errors.password ? this.state.errors.password : null}
                  </div> 
                  <button type="submit" className="btn btn-outline-primary">Подтвердить</button>
                  <div className="pt-3">
                    <span className="pr-2 text-secondary">Уже зарегестрированы?</span>
                    <Link className="" to="/user/login">Вход</Link>
                  </div>
                </form>
            </div>
        )
    }
}
export default Signup;