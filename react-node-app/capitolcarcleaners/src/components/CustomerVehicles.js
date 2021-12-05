import React, { useState, useEffect } from 'react';
import "../css/CustomerVehicles.css"
import Axios from 'axios';
import { Button, Row, Col, Card, Modal, Form, Alert } from "react-bootstrap";
import { useSelector } from 'react-redux';

function CustomerVehicles(props) {
    const userId = useSelector((state) => state.userId.value);
    const token = useSelector((state) => state.token.value);

    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [validated, setValidated] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [userVehicles, setUserVehicles] = useState([]);

    useEffect(() => { 
        if (userId != null){
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
                    setUserVehicles([]);
                    console.log(JSON.stringify(response.data.message))   
                } 
                else {   
                    var vehicles = []
                    vehicles = Array(response.data.data)[0]
                    setUserVehicles(vehicles);
                }
            });   
        }    
    }, [userId, showAddVehicleModal, showDeleteModal]);

    const getVehicles = () => {
        if(userVehicles.length <= 0) {
            return (
                <Card style={{ width: '18rem', marginLeft: '10px', marginTop: '10px' }}>
                    <Card.Img variant="top" src="/CarLogo.png" />
                        <Card.Body>
                            <Card.Title>You have not yet added any vehicles.</Card.Title>
                            <Card.Text>To add a vehicle, hit the Add Vehicle button.</Card.Text>
                        </Card.Body>
                </Card>
            )
        }
        let vehicles = [];

        for(let i =0; i < userVehicles.length; i++) {
            vehicles.push(
                userVehicleCard(userVehicles[i])
            )
        }

        return vehicles;
    }

    const addVehicles = () => {
        
    
        const handleSubmit = (event) => {
            const form = event.currentTarget;
            
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            setValidated(true);
    
            // Output Caputured Data
            if (form.checkValidity() === true) {          
                Axios.post("http://localhost:3001/addVehicle",{
                    uid: userId,
                    make: event.target.elements.VehMake.value,
                    model: event.target.elements.VehModel.value,
                    year: event.target.elements.VehYear.value,
                    color: event.target.elements.VehColor.value,
                    licensePlate: event.target.elements.VehLicensePlate.value,
                    additionalInfo: event.target.elements.VehAddtlInfo.value,
                }, {
                    headers: {
                        authorization: token
                    },
                }).then((response) => {
                    if(response.data.err) {
                        console.log(response.data.err);
                        setShowAddVehicleModal(false);
                    }
                    else if (response.data.message) {
                        console.log(response.data.message);
                        setShowAddVehicleModal(false);
                    } 
                    else {     
                        setShowAddVehicleModal(false);
                    }
                });
            }          
        };
    
        return (
            <>            
                <Row style={{padding: '5%'}}>
                <div >            
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="VehMake">
                            <Form.Label column sm="3">Make</Form.Label>
                            <Col sm="8" >
                                <Form.Control  
                                required
                                type="text"
                                placeholder="Make"
                                />
                            </Col>                    
                        </Form.Group> 
    
                        <Form.Group as={Row} className="mb-3" controlId="VehModel">
                            <Form.Label column sm="3">Model</Form.Label>
                            <Col sm="8" >
                                <Form.Control  
                                required
                                type="text"
                                placeholder="Model"
                                />
                            </Col>                    
                        </Form.Group>  
    
                        <Form.Group as={Row} className="mb-3" controlId="VehYear">
                            <Form.Label column sm="3">Year</Form.Label>
                            <Col sm="8" >
                                <Form.Control  
                                required
                                type="text"
                                placeholder="Year"
                                />
                            </Col>                    
                        </Form.Group>
    
                        <Form.Group as={Row} className="mb-3" controlId="VehColor">
                            <Form.Label column sm="3">Color</Form.Label>
                            <Col sm="8" >
                                <Form.Control  
                                required
                                type="text"
                                placeholder="Color"
                                />
                            </Col>                    
                        </Form.Group>
    
                        <Form.Group as={Row} className="mb-3" controlId="VehLicensePlate">
                            <Form.Label column sm="3">License Plate</Form.Label>
                            <Col sm="8" >
                                <Form.Control  
                                required
                                type="text"
                                placeholder="License Plate Number"
                                />
                            </Col>                    
                        </Form.Group>
    
                        <Form.Group as={Row} className="mb-3" controlId="VehAddtlInfo">
                            <Form.Label column sm="3">Additional Information</Form.Label>
                            <Col sm="8" >
                                <Form.Control  
                                type="text"
                                placeholder=""
                                />
                            </Col>                    
                        </Form.Group>
                        <div style={{textAlign: 'center'}}>
                            <Button className="m-4" type="submit" style={{display: 'inline-block'}}>Submit</Button>  
                        </div>
                    </Form>        
                </div>     
                </Row> 
            </>
        )
    }

    const userVehicleCard = (vehicle) => {
        
        const deleteVehicle = () => {
            Axios.post("http://localhost:3001/deleteVehicle",{
                vid: vehicle.vid
            }, {
                headers: {
                    authorization: token
                },
            }).then((response) => {
                if(response.data.err) { // Can't delete vehicle that still has scheduled appointments
                    if(response.data.err.errno === 1451) {
                        setShowDeleteModal(false);
                        return (
                            alert("Please delete any appointments attached to this vehicle before attempting to remove it from your account." )
                        )
                    }
                    else {
                        setShowDeleteModal(false);
                        return (
                            alert("Please see console for error." )
                        )
                    }
                    
                }
                else if (response.data.message === "Vehicle is not found!") { //change this later as it does not match with the alert
                    setShowDeleteModal(false);
                    return (
                        alert("Vehicle was not found in system.")
                    )
                } 
                else { 
                    setShowDeleteModal(false);
                }
            });
            
        };
    
        return (
            <> 
               <Card style={{ width: '18rem', marginLeft: '10px', marginTop: '10px' }}>
                    <Card.Img variant="top" src="/CarLogo.png" style={{width: "75%"}} />
                    <Card.Body>
                        <Card.Title>{vehicle.year}, {vehicle.make} {vehicle.model} </Card.Title>
                        <Card.Text>
                            Color: {vehicle.color} <br />
                            License Plate: {vehicle.licensePlate}
                        <br />
                        </Card.Text>
                        <div style={{textAlign: 'center'}}>
                            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete Vehicle</Button>
                            <Modal
                                show={showDeleteModal}
                                onHide={() => setShowDeleteModal(false)}
                                centered
                                backdrop="static"
                            >
                                <Modal.Header >
                                    <Modal.Title>Delete Vehicle</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p>Are you sure you want to remove this vehicle?</p>
                                    <div style={{textAlign: 'center'}}>
                                        <Button variant="primary" size='sm' style={{margin: '5px'}} onClick={deleteVehicle}>Confirm</Button> 
                                        <Button variant="secondary" size='sm' style={{margin: '5px'}} onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                                    </div>
                                </Modal.Body>                   
                            </Modal>
                        </div>
                    </Card.Body>
                </Card>
            </>
        )
    }


    return (
        <> 
            <Row>								
                <Col>
                    <h2 className="sectionVehicleTitle">Your Vehicles:</h2>
                </Col>

                <Col>
                    <div style={{textAlign: 'right'}}>
                        <Button onClick={() => setShowAddVehicleModal(true)} style={{marginRight: '10px'}}>Add Vehicle</Button>

                        <Modal
                            show={showAddVehicleModal}
                            onHide={() => setShowAddVehicleModal(false)}
                            centered
                            backdrop="static"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Add Personal Vehicle:</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {addVehicles()}
                            </Modal.Body>                                            
                        </Modal>
                    </div>
                </Col>                                  
            </Row>

            <hr 
                style= {{
                    height: 5, 
                    width: "100%", 
                    color: "black",
                    marginTop: "9px"                               
                }}
            />

            <br />

            <Row style={{justifyContent: "center"}} xs={2} md={3} className="g-4">
                {getVehicles()}
            </Row>
        </>
    )


}

export default CustomerVehicles;