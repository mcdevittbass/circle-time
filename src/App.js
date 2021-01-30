import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Main from './components/arena/Main';
import HomePage from './components/auth/Home';
import AccountPage from './components/account/AccountPage';

function App() {
  return (
      <Router>
        <Switch>
          <Route path='/home' component={HomePage}></Route>
          <Route path='/account' component={AccountPage}></Route>
          <Route path='/app' component={Main}></Route>
          <Redirect to='/home' />
        </Switch>  
      </Router>
  )
}

export default App;