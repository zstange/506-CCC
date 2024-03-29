import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './store';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import Header from './components/Header';
import CreateAccount from './components/CreateAccount';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import ViewAppointments from './components/ViewAppointments'
import CustomerHomepage from './components/CustomerHomepage';
import CustomerHistory from './components/CustomerHistory';
import Login from './components/Login';
import VehiclesForSale from './components/VehiclesForSale';
import ServiceCompleteAD from './components/ServiceCompleteAD';
import ServiceExteriorAD from './components/ServiceExteriorAD';
import ServiceInteriorAD from './components/ServiceInteriorAD';
import ServiceOdorRemoval from './components/ServiceOdorRemoval';
import ServiceRustProof from './components/ServiceRustProof';
import ServiceCeramicCoat from './components/ServiceCeramicCoat';
import ServiceMotorcycle from './components/ServiceMotorcycle';
import ServiceBoat from './components/ServiceBoat';
import ServiceBlinds from './components/ServiceBlinds';
import ContactUs from './components/ContactUs';
import Promotions from './components/Promotions';
import Gallery from './components/Gallery';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

const { store, persistor } = createStore();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
            <Route path="/VehiclesForSale" component={VehiclesForSale} />
            <Route path="/ServiceCompleteAD" component={ServiceCompleteAD} />
            <Route path="/ServiceInteriorAD" component={ServiceInteriorAD} />
            <Route path="/ServiceExteriorAD" component={ServiceExteriorAD} />
            <Route path="/ServiceOdorRemoval" component={ServiceOdorRemoval} />
            <Route path="/ServiceRustProof" component={ServiceRustProof} />
            <Route path="/ServiceCeramicCoat" component={ServiceCeramicCoat} />
            <Route path="/ServiceMotorcycle" component={ServiceMotorcycle} />
            <Route path="/ServiceBoat" component={ServiceBoat} />
            <Route path="/ServiceBlinds" component={ServiceBlinds} />
            <Route path="/ContactUs" component={ContactUs} />
            <Route path="/Promotions" component={Promotions} />
            <Route path="/Gallery" component={Gallery} />
          </Switch>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
