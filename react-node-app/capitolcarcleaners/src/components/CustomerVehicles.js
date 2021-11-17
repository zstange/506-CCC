import React, { useState } from 'react';
import "../css/CustomerVehicles.css"
import Axios from 'axios';
import { Button, Row, Col, Card, Modal, Form, Alert } from "react-bootstrap";

function UserVehicles(props) {
    //console.log("Vehicles"+ JSON.stringify(props.vehiclesList.make))
    const[modal, setModal] = useState(false);

    const deleteVehicle = () => {
        Axios.post("http://localhost:3001/deleteVehicle",{
            vid: props.vehiclesList.vid
        }).then((response) => {
            console.log("DEL: " + JSON.stringify(response))
            if(response.data.err) {
                console.log(response.data.err)
            }
            else if (response.data.message) {
                console.log(response.data.message)
                return (
                    <Alert 
                        variant={"primary"} >
                        "Please delete any appointments attached to this vehicle before attempting to remove it from your account." 
                    </Alert>
                )
            } 
            else {     
                // remove vehicle 
                console.log("DEL ELSE: " + JSON.stringify(response))
                return;
            }
        });
        setModal(false)
    };

    return (
        <> 
           <Card style={{ width: '18rem', marginLeft: '10px', marginTop: '10px' }}>
                <Card.Img className="cardImage" variant="top" src="/CarLogo.png" />
                <Card.Body>
                    <Card.Title>{props.vehiclesList.year}, {props.vehiclesList.make} {props.vehiclesList.model} </Card.Title>
                    <Card.Text>
                        Color: {props.vehiclesList.color} <br />
                    Date of last detailing: 
                    <br />
                    </Card.Text>
                    <div style={{textAlign: 'center'}}>
                        <Button variant="danger" onClick={() => setModal(true)}>Delete Vehicle</Button>
                        <Modal
                            show={modal}
                            onHide={() => setModal(false)}
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
                                    <Button variant="secondary" size='sm' style={{margin: '5px'}} onClick={() => setModal(false)}>Cancel</Button>
                                </div>
                            </Modal.Body>                   
                        </Modal>
                    </div>
                </Card.Body>
            </Card>
        </>
    )
}

function AddVehicles(props) {
    const [validated, setValidated] = useState(false);

    const getVehicles = () => {
        //console.log("PROPS"+ props.userVehicles[1].make)
        let vehicles = [];
        for(let i =0; i < this.props.userVehicles.length; i++) {
            vehicles.push(
                <UserVehicles vehiclesList={this.props.userVehicles[i]} />
            )
        }
        return vehicles
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;

        console.log("EVENT: "+ event.target.elements.VehModel)
        // console.log("MAKE: " + event.target.element.VehMake.value)
        // console.log("MODEL: " + event.target.element.VehModel.value)
        // console.log("YEAR: " + event.target.element.VehYear.value)
        // console.log("COLOR: " + event.target.element.VehColor.value)
        // console.log("LP: " + event.target.element.VehLicensePlate.value)
        // console.log("ADD INFO: " + event.target.element.VehAddtlInfo.value)
        
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        setValidated(true);

        // Output Caputured Data
        if (form.checkValidity() === true) {          
            Axios.post("http://localhost:3001/addVehicle",{
                uid: props.userId,
                make: event.target.elements.VehMake.value,
                model: event.target.elements.VehModel.value,
                year: event.target.elements.VehYear.value,
                color: event.target.elements.VehColor.value,
                licensePlate: event.target.elements.VehLicensePlate.value,
                additionalInfo: event.target.elements.VehAddtlInfo.value,
            }).then((response) => {
                console.log("ADD Vehicles: " + JSON.stringify(response))
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.message)
                } 
                else {     
                    // remove vehicle 
                    console.log("ADD ELSE: " + JSON.stringify(response))
                    return getVehicles()
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
                            required
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

class CustomerVehicles extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.userId,
            showAddVehicle: false,
            showModal: false,
        };
    }

    openModal() {
        this.setState({ showModal: true });
    }
    
    closeModal() {
        this.setState({ showModal: false });
    }

    openAddVehicle() {
        this.setState({ showAddVehicle: true });
    }

    closeAddVehicle() {
        this.setState({ showAddVehicle: false });
    }

    getVehicles() {
        //console.log("PROPS"+ props.userVehicles[1].make)
        if(this.props.userVehicles.length <= 0) {
            return (
                <Card style={{ width: '18rem', marginLeft: '10px', marginTop: '10px' }}>
                    <Card.Img className="cardImage" variant="top" src="/CarLogo.png" />
                        <Card.Body>
                            <Card.Title>You have not yet added any vehicles.</Card.Title>
                            <Card.Text>To add a vehicle, hit the Add Vehicle button.</Card.Text>
                        </Card.Body>
                </Card>
            )
        }
        else {
            let vehicles = [];
            for(let i =0; i < this.props.userVehicles.length; i++) {
                vehicles.push(
                    <UserVehicles vehiclesList={this.props.userVehicles[i]} />
                )
            }
            return vehicles
        }
    }

    render() {
        return (
            <> 
                <Row>								
                    <Col>
                        <h2>Your Vehicles:</h2>
                    </Col>

                    <Col>
                        <div style={{textAlign: 'right'}}>
                            <Button onClick={() => this.openAddVehicle()} style={{marginRight: '10px'}}>Add Vehicle</Button>

                            <Modal
                                show={this.state.showAddVehicle}
                                onHide={() => this.closeAddVehicle()}
                                centered
                                backdrop="static"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Add Personal Vehicle:</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <AddVehicles                                        
                                        showAddVehicle={this.state.showAddVehicle}
                                        userId={this.props.userId}
                                    />
                                </Modal.Body>                                            
                            </Modal>
                        </div>
                    </Col>                           
                    
                    <hr 
                        style= {{
                            height: 5, 
                            width: "100%", 
                            color: "black",
                            marginBottom: '10px'                                
                        }}
                    />                                
                </Row>

                <br />

                <Row xs={2} md={3} className="g-4">
                    {this.getVehicles()}
                </Row>
            </>
        )
    }
}

export default CustomerVehicles;