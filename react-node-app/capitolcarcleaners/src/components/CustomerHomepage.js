import React, {useEffect, useState} from "react";
import "../css/CustomerHomepage.css"
import ViewAppointments from "./ViewAppointments";
import Axios from 'axios';
import { Row} from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion'
import { useSelector } from 'react-redux';
import CustomerInfo from "./CustomerInfo";
import CustomerVehicles from "./CustomerVehicles";
import CustomerHistory from "./CustomerHistory";
import AccordionHeader from "react-bootstrap/esm/AccordionHeader";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { Redirect } from "react-router-dom";

function CustomerHomepage(props) {
    const loggedIn = useSelector((state) => state.loggedIn.value);
    const userId = useSelector((state) => state.userId.value);
    const token = useSelector((state) => state.token.value);

    const [userVehicles, setUserVehicles] = useState([]);
    const [userData, setUserData] = useState({});

    useEffect(() => { 
        if (userId != null){
            Axios.post("http://localhost:3001/getUser", {
                uid: userId
            },{
                headers: {
                    authorization: token
                },
            }).then((response) => {
                setUserData(response.data.data[0]);
            });
        
            Axios.post("http://localhost:3001/getVehicles",{
                uid: userId
            }, {
                headers: {
                    authorization: token
                },
            }).then((response) => {
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
                    setUserVehicles(vehicles);
                }
            });   
        } 
        
    }, [userId]);

    return (
        <>     
            {loggedIn ? null : <Redirect to="/Login"/>}    
            <div style={{marginBottom: '10px', marginTop: '5px', }} className="welcomeText">
                <Row >
                    <h1 >Welcome, {userData.firstName}</h1>                                         
                </Row>
            </div> 

            <div style={{ background: "#F0F2F4"}} >
                <div style={{padding:'50px'}}>
                    <Row style={{justifyContent: 'center'}}>
                        <div className="col-lg-4 col-xs-5 mx-4" >
                            {/* Account Info Section */}
                            <div className="border p-3" style={{ background: "#FFFFFF"}}>
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
                            <div className="border p-3" style={{ background: "#FFFFFF"}}>
                                <CustomerVehicles
                                    userId = {userId}
                                    userVehicles = {userVehicles}
                                />
                            </div>
                        </div>
                    </Row>
                    <br />
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Row style={{justifyContent: 'center'}}>                                
                                <div className="border p-3" style={{ background: "#FFFFFF"}}>
                                    <AccordionHeader>
                                        <h3 className="sectionAccTitle">Appointments:</h3>
                                    </AccordionHeader>
                                    <hr 
                                        style= {{
                                            height: 5, 
                                            width: "100%", 
                                            color: "black",                              
                                        }}
                                    />
                                    <AccordionBody>
                                        <ViewAppointments/>     
                                    </AccordionBody>                   
                                </div>
                            </Row>
                        </Accordion.Item>
                    </Accordion>
                    <br />
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Row style={{justifyContent: 'center', }}>
                                <div className="border p-3" style={{ background: "#FFFFFF"}}>
                                    <AccordionHeader>
                                        <h3 className="sectionAccTitle">Service History:</h3>
                                    </AccordionHeader>
                                    <hr 
                                        style= {{
                                            height: 5, 
                                            width: "100%", 
                                            color: "black",                              
                                        }}
                                    />
                                    <AccordionBody> 
                                        <CustomerHistory/>   
                                    </AccordionBody>                     
                                </div>
                            </Row>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </div>
        </>
    );



}

export default CustomerHomepage;