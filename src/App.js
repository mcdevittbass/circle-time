import React from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import Main from './components/Main'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/app'><Main /></Route>
        <Redirect to='/app' />
      </Switch>
      
    </Router>

  )
}

export default App;