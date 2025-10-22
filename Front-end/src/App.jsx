// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';

const App = () => {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div>
        <h1>Welcome to Mentee App</h1>
        <Switch>
          <Route path="/login" render={() => <Login setAuth={setAuth} />} />
          <Route path="/register" render={() => <Register setAuth={setAuth} />} />
          <Route path="/logout" render={() => <Logout setAuth={setAuth} />} />
          <Route path="/dashboard" render={() => auth ? <h2>Dashboard</h2> : <Login setAuth={setAuth} />} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
