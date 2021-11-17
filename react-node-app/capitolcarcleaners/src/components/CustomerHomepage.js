import React, {useState} from "react";
import "../css/CustomerHomepage.css"
import ViewAppointments from "./ViewAppointments";
import Axios from 'axios';
import { Row, } from "react-bootstrap";
import { connect } from 'react-redux';
import CustomerInfo from "./CustomerInfo";
import CustomerVehicles from "./CustomerVehicles";

class CustomerHomepage extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {
            showAddVehicle: false,    
            userVehicles: [],
            userData: []    
        };
    } 

    getFirstName() {
        // fetches username from DB
        var firstName = "User " + this.props.userId.value;
        return firstName
    }

    openAddVehicle() {
        this.setState({ showAddVehicle: true });
    }

    closeAddVehicle() {
        this.setState({ showAddVehicle: false });
    }

    componentDidUpdate(prevProps) {  
        if(prevProps.userId.value != this.props.userId.value) {
            console.log(this.props.userId.value)

            Axios.post("http://localhost:3001/getUser", {
               uid: this.props.userId.value
            }).then((response1) => {
                let user = [Array(response1.data.data)[0][0].email, Array(response1.data.data)[0][0].firstName, 
                    Array(response1.data.data)[0][0].lastName, Array(response1.data.data)[0][0].password, Array(response1.data.data)[0][0].phoneNumber]
                console.log(user)
                this.setState({userData: user})

            });
           
            Axios.post("http://localhost:3001/getVehicles",{
               uid: this.props.userId.value
           }).then((response) => {
               console.log("Response from getUser " + JSON.stringify(response))
               if(response.data.err) {
                   console.log("ERR: " + JSON.stringify(response.data.err))
               }
               else if (response.data.message) {
                   // No vehicles added to account
                   console.log(JSON.stringify(response.data.message))   
               } 
               else {     
                   var vehicles = []
                   vehicles = Array(response.data.data)[0]
                   this.setState({userVehicles: vehicles})
               }
           }); 
        }    
    }

    render() {
        return (
            <>                
                <div style={{marginBottom: '10px', marginTop: '5px', }} className="welcomeText">
                    <Row >
                        <h1 >Welcome, {this.state.userData[1]}</h1>                                         
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
                            <CustomerInfo 
                                userData={this.state.userData}
                            />
                        </div>

                        <br />
                    </div>

                    <div className='col-lg-7 col-xs-5 mx-4'>
                        {/* User's Vehicles Section */}
						<div className="border p-3">
                            <CustomerVehicles
                                userId = {this.props.userId.value}
                                userVehicles = {this.state.userVehicles}
                            />
                        </div>
                    </div>
                </Row>
                <Row style={{justifyContent: 'center', padding: '50px'}}>
                    <div className="border p-3">
                        <h3 className="sectionAccTitle">Upcoming Appointments:</h3>
                        <hr 
                            style= {{
                                height: 5, 
                                width: "100%", 
                                color: "black",                              
                            }}
                        />
                        
                        <ViewAppointments/>                        
                    </div>
                </Row>
            </>
         );
    }
}
function mapStateToProps(state, ownProps) {
    const userId = state.userId;
    const role = state.role;
    return {userId, role};
}
export default connect(mapStateToProps)(CustomerHomepage);