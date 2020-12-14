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

import Navbar from './components/BaseParts/Navbar'
import DeviceApp from './pages/device/deviceApp'
import CompanyApp from './pages/company/companyApp'
import WelcomePage from './pages/welcome'
import Login from './pages/users/login'
import Registration from './pages/users/registration'
import ProfilePage from './pages/users/profile'
import Page404 from './pages/pageNotFound'

import auth from './utils/auth'

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


