import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Main from './components/arena/Main';
import HomePage from './components/auth/Home';
import AccountPage from './components/account/AccountPage';

function App({ firebase }) {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listener = firebase.auth.onAuthStateChanged(user => {
      user 
        ? setAuthUser(user)
        : setAuthUser(null);
    })
    return () => {
      listener();
    }
  }, [firebase.auth]);

  return (
      <Router>
        <Switch>
          <Route path='/home' component={HomePage} />
          <Route path='/account' render={() => <AccountPage authUser={authUser} />} />
          <Route path='/app' render={() =><Main authUser={authUser} />} />
          <Redirect to='/home' />
        </Switch>  
      </Router>
  )
}

export default App;