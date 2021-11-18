import React, {useEffect, useState} from "react";
import "../css/CustomerHomepage.css"
import ViewAppointments from "./ViewAppointments";
import Axios from 'axios';
import { Row, } from "react-bootstrap";
import { useSelector } from 'react-redux';
import CustomerInfo from "./CustomerInfo";
import CustomerVehicles from "./CustomerVehicles";

function CustomerHomepage(props) {
    const userId = useSelector((state) => state.userId.value);

    const [userVehicles, setUserVehicles] = useState([]);
    const [userData, setUserData] = useState({});

    useEffect(() => { 
        if (userId != null){
            Axios.post("http://localhost:3001/getUser", {
                uid: userId
            }).then((response) => {
                setUserData(response.data.data[0]);
            });
        
            Axios.post("http://localhost:3001/getVehicles",{
                uid: userId
            }).then((response) => {
                if(response.data.err) {
                    console.log("ERR: " + JSON.stringify(response.data.err))
                }
                else if (response.data.message) {
                    // No vehicles added to account
                    console.log(JSON.stringify(response.data.message))   
                } 
                else { 
                    console.log(response)    
                    var vehicles = []
                    vehicles = Array(response.data.data)[0]
                    setUserVehicles(vehicles);
                }
            });   
        } 
        
    }, [userId]);

    return (
        <>                
            <div style={{marginBottom: '10px', marginTop: '5px', }} className="welcomeText">
                <Row >
                    <h1 >Welcome, {userData.firstName}</h1>                                         
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
                            userData={userData}
                        />
                    </div>

                    <br />
                </div>

                <div className='col-lg-7 col-xs-5 mx-4'>
                    {/* User's Vehicles Section */}
                    <div className="border p-3">
                        <CustomerVehicles
                            userId = {userId}
                            userVehicles = {userVehicles}
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

export default CustomerHomepage;