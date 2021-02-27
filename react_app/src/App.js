import './App.css'
import '../node_modules/react-vis/dist/style.css'

import React, { useEffect, useState } from 'react' 
import {
  BrowserRouter as Router, 
  Switch, 
  Route,
} from 'react-router-dom'

import {ProtectedRoute} from './utils/protectedRoute'
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import DeviceApp from './device/deviceApp'
import CompanyApp from './company/companyApp'
import Login from './users/pages/login'
import Registration from './users/pages/registration'
import ProfilePage from './users/pages/profile'
import Navbar from './base/components/Navbar'
import WelcomePage from './base/pages/welcome'
import Page404 from './base/pages/pageNotFound'

import auth from './backendAPI/auth'

export default function App() {
  const [loading, setLoading] = useState(true)
  const [loading2, setLoading2] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [userInfo, setUserInfo] = useState({})

  const handle = useFullScreenHandle();

  useEffect(() => {
    auth.checkAuthentication(() => { setLoading(false) })
    auth.onLogin = () => {setAuthed(true)}    
    auth.onLogout = () => {setAuthed(false)}    
    auth.onUserInfoReaded = (ui) => {
      setUserInfo(ui); 
      setLoading2(false);
    }   
  }, [])

  if (loading || loading2) { 
    return null 
  } else { 
    return (
      <React.Fragment>
        <button className='full-screen-button fas fa-expand ' onClick={handle.enter}></button>
        <FullScreen handle={handle}>
          <Router>        
            <Route exact path='/' component={()=>{
              return (
              <video autoplay="autoplay" muted loop="loop" id="myVideo">
                <source src="Earth13426.mp4" type="video/mp4" />
              </video>
              )}
            }/>

            <Navbar authed={authed} userInfo = {userInfo} />
            <Switch>
              <Route exact path='/' component={WelcomePage} />
              <Route exact path='/user/login' component={Login}  />
              <Route exact path='/user/registration' component={Registration} />
              <ProtectedRoute exact path='/user/profile' component={ ()=> <ProfilePage userInfo = {userInfo} /> } />
              <ProtectedRoute path='/company' component={CompanyApp} />                   
              <ProtectedRoute path='/device/:id' component={DeviceApp} />
              <Route component={Page404} />
            </Switch>
          </Router>
        </FullScreen>
      </React.Fragment>
    )
  }
}


