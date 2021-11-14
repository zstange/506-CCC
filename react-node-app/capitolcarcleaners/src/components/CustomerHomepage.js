import React, {useState} from "react";
import "../css/CustomerHomepage.css"
import Calendar from "../components/Calendar"
import ViewAppointments from "./ViewAppointments";
import Axios from 'axios';
import { Form, Card, Button, Row, Col, Modal } from "react-bootstrap";
import { connect } from 'react-redux';
import CustomerInfo from "./CustomerInfo";
import CustomerVehicles from "./CustomerVehicles";

/*
 * Do we need a spot to change the option to receive promotions (true/false)?
 */

class CustomerHomepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddVehicle: false,    
            userVehicles: [],
            userData: {}    
        };
    } 

    getFirstName() {
        // fetches username from DB
        var firstName = "User " + this.props.userId.value;
        return firstName
    }

    getLastName() {
        // fetches username from DB
        var lastName = this.props.role.value;
        return lastName
    }

    getEmail() {
        // fetches email from DB
        var email = "TEST Email";
        return email
    }

    getPhoneNumber() {
        // fetches phone Number from DB
        var pNum = "TEST XXX-XXX-XXXX";
        return pNum
    }

    openAddVehicle() {
        this.setState({ showAddVehicle: true });
    }

    closeAddVehicle() {
        this.setState({ showAddVehicle: false });
    }

    async componentDidMount() {
        console.log("CDM ran")

        await Axios.get("http://localhost:3001/getUser",{
            uid: this.props.userId.value
        }).then((response1) => {
            //console.log("Response from getUser " + response1)
            //console.log("Response from getUser " + JSON.stringify(response1))
            //this.setState({userData = response.data})
        });
        
        await Axios.post("http://localhost:3001/getVehicles",{
            uid: 25
        }).then((response) => {
            if(response.data.err) {
                console.log("ERR: " + response.data.err)
            }
            else if (response.data.message) {
                // No vehicles added to account
                console.log("MSG: " + response.data.err)

            } 
            else {     
                var vehicles = []
                vehicles = Array(response.data.data)[0]
                this.setState({userVehicles: vehicles})
            }
        }); 
    }

    render() {
        return (
            <>
                <div style={{marginBottom: '10px'}}>
                    <Row>
                        <h1>Welcome, {this.getFirstName()}</h1>                                         
                    </Row>
                </div> 

                <Row style={{justifyContent: 'center'}}>
                    <div className="col-lg-4 col-xs-5 mx-4">
                        {/* Account Info Section */}
                        <div className="border p-3">
                            <h3 className="sectionAccTitle">Account Information:</h3>
                            <hr 
                                style= {{
                                    height: 5, 
                                    width: "100%", 
                                    color: "black",                              
                                }}
                            />
                            <CustomerInfo />
                        </div>

                        <br />
                    </div>

                    <div className='col-lg-7 col-xs-5 mx-4'>
                        {/* User's Vehicles Section */}
						<div className="border p-3">
                            <CustomerVehicles
                                userVehicles = {this.state.userVehicles}
                            />
                        </div>
                    </div>
                </Row>
                <Row>
                <h3 className="sectionAccTitle">Upcoming Appointments:</h3>
                     <ViewAppointments/>
                </Row>
            </>
         );
    }
}

function mapStateToProps(state) {
    const userId = state.userId;
    const role = state.role;
    return {userId, role};
}
  
export default connect(mapStateToProps)(CustomerHomepage);