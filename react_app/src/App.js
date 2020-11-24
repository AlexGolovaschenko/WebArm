import './App.css'
import '../node_modules/react-vis/dist/style.css'

import React from 'react' 
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import Navbar from './components/BaseParts/Navbar'
import DeviceApp from './pages/device/deviceApp'
import WelcomePage from './pages/welcome'
import Login from './pages/users/login'
import Registration from './pages/users/registration'

import Page404 from './pages/pageNotFound'

function App() {

  return (
    <React.Fragment>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={WelcomePage} />
          <Route path='/device' component={DeviceApp} />
          <Route exact path='/user/login' component={Login} />
          <Route exact path='/user/registration' component={Registration} />
          <Route component={Page404} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
