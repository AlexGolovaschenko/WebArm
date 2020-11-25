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
import WelcomePage from './pages/welcome'
import Login from './pages/users/login'
import Registration from './pages/users/registration'
import Page404 from './pages/pageNotFound'

import auth from './utils/auth'

export default function App() {
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    auth.checkAuthentication(() => { setLoading(false) });    
  }, [])

  if (loading) { 
    return null 
  } else { 
    return (
      <React.Fragment>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path='/' component={WelcomePage} />
            <Route exact path='/user/login' component={Login}  />
            <Route exact path='/user/registration' component={Registration} />
            <ProtectedRoute path='/device' component={DeviceApp} />
            <Route component={Page404} />
          </Switch>
        </Router>
      </React.Fragment>
    )
  }
}


