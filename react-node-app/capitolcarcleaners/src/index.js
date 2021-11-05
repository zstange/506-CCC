import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './components/Header';
import CreateAccount from './components/CreateAccount';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import ViewAppointments from './components/ViewAppointments'
import Login from './components/Login';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header/>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/Login" component={Login} />
        <Route path="/CreateAccount" component={CreateAccount} />
        <Route path="/ForgotPassword" component={ForgotPassword} />
        <Route path="/ViewAppointments" component={ViewAppointments} />
     </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
