import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Main from './components/room/Main';
import HomePage from './components/auth/Home';
import AccountPage from './components/account/AccountPage';
import { FirebaseContext } from './components/firebase/context';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [roomId, setRoomId] = useStickyState(null, 'roomId');

  const firebase = useContext(FirebaseContext);

  //check for authorization
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
          <Route path='/account' render={() => <AccountPage authUser={authUser} roomId={roomId} setRoomId={setRoomId}/>} />
          <Route path='/app' render={() =><Main authUser={authUser} roomId={roomId} setRoomId={setRoomId} />} />
          <Redirect to='/home' />
        </Switch>  
      </Router>
  )
}

export default App;

//from https://joshwcomeau.com/react/persisting-react-state-in-localstorage/
function useStickyState(defaultValue, key) {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}