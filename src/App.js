import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.scss';
import Main from './components/Main';
import HomePage from './components/Home';

function App() {
  return (
      <Router>
        <Switch>
          <Route path='/home'><HomePage /></Route>
          <Route path='/app'><Main /></Route>
          <Redirect to='/home' />
        </Switch>  
      </Router>
  )
}

export default App;