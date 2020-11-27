import './App.css'
import '../node_modules/react-vis/dist/style.css'

import React, { useEffect } from 'react' 
import {
  BrowserRouter as Router, 
  Switch, 
  Route,
} from 'react-router-dom'

import {ProtectedRoute} from './utils/protectedRoute'

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
  const [loading, setLoading] = React.useState(true)
  const [authed, setAuthed] = React.useState(false)
  const [userInfo, setUserInfo] = React.useState({})

  useEffect(() => {
    auth.checkAuthentication(() => { setLoading(false) })
    auth.onLogin = () => {setAuthed(true)}    
    auth.onLogout = () => {setAuthed(false)}    
    auth.onUserInfoReaded = (ui) => {setUserInfo(ui)}   
  }, [])

  if (loading) { 
    return null 
  } else { 
    return (
      <React.Fragment>
        <Router>
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
      </React.Fragment>
    )
  }
}


