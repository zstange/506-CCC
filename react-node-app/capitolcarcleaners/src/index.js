import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import Header from './components/Header';
import CreateAccount from './components/CreateAccount';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import ViewAppointments from './components/ViewAppointments'
import CustomerHomepage from './components/CustomerHomepage';
import CustomerHistory from './components/CustomerHistory';
import Login from './components/Login';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Header/>
        <Switch>
          <Route exact path="/">
            <Redirect to="/Home" />
          </Route>
          <Route exact path="/Home" component={Home} />
          <Route path="/Login" component={Login} />
          <Route path="/CreateAccount" component={CreateAccount} />
          <Route path="/ForgotPassword" component={ForgotPassword} />
          <Route path="/ViewAppointments" component={ViewAppointments} />
          <Route path="/CustomerHomepage" component={CustomerHomepage} />
          <Route path="/CustomerHistory" component={CustomerHistory} />
      </Switch>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
