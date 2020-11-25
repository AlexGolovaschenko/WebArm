import './App.css'
import '../node_modules/react-vis/dist/style.css'

import React from 'react' 
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'

import Navbar from './components/BaseParts/Navbar'
import DeviceApp from './pages/device/deviceApp'
import WelcomePage from './pages/welcome'
import Login from './pages/users/login'
import Registration from './pages/users/registration'

import Page404 from './pages/pageNotFound'



function PrivateRoute ({component: Component, authed, user, ...rest}) {
  console.log('authed: ', authed)
  console.log('user: ', user)
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/', state: {from: props.location}}} />}
    />
  )
}



function App() {
  const [user, setUser] = React.useState({
    username: '',
    authed: false,
    setAuthed: setAuthed
  })

  function setAuthed(state){
    setUser((prev) => {
      return {...prev, authed: state}
    })
  }
  
  const props = {user: user}

  return (
    <React.Fragment>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={WelcomePage} />
          <Route exact path='/user/login' component={() => <Login {...props} />}  />
          <Route exact path='/user/registration' component={() => <Registration {...props} />} />
          <PrivateRoute path='/device' component={() => <DeviceApp {...props} />} authed={user.authed} />
          <Route component={Page404} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}


export default App;
