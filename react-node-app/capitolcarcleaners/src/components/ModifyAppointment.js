import React, {useState} from "react"; 
import Axios from 'axios';
import '../css/ViewAppointments.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'
import { Redirect } from 'react-router-dom';
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";

function ModAppointment(props) {
    return null;
}

class ModifyAppointment extends React.Component {
  render() {
    return (
        <>
        <br></br>
        <div>
            <h1 className="createAccountHeaders">View Appointments</h1>
        </div>
        <Row style={{padding: '1%'}}>
            <div className="List">   
            <h4 className="createAccountLabels mb-1">Upcoming Appointments:</h4>
            <br></br>  
            <Form noValidate >
                <Card id = {2} style={{width: '75rem' }}>
                <Card.Header>
                    <Form.Group as={Row} style = {{marginLeft: "0%"}}className="mb-3"  controlId="service">
                        <Form.Label column sm="1" className="createAccountLabels">Service</Form.Label>
                            <Col sm="7" >
                                <Form.Control  
                                required
                                type = "date"
                                placeholder="make me a drop down"
                                />
                            </Col>                    
                    </Form.Group>
                </Card.Header>
                <Card.Body>
                    <Card.Title></Card.Title>                  
                    <ListGroup className="list-group-flush">
                        <ListGroupItem>
                            <Form.Group as={Row} className="mb-3"  controlId="date">
                                <Form.Label column sm="1" className="createAccountLabels">Date</Form.Label>
                                <Col sm="7" >
                                    <Form.Control  
                                    required
                                    type = "date"
                                    placeholder="make me a drop down"
                                    />
                                </Col>                    
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3"  controlId="time">
                                <Form.Label column sm="1" className="createAccountLabels">Time</Form.Label>
                                <Col sm="7" >
                                    <Form.Control  
                                    required
                                    type = "time"
                                    placeholder="make me a drop down"
                                    />
                                </Col>                    
                            </Form.Group>
                        </ListGroupItem> 
                        <ListGroupItem style={{marginTop: "1%"}}>
                            <Form.Group as={Row} className="mb-3"  controlId="vehicle">
                            <Form.Label column sm="1" className="createAccountLabels">Vehicle</Form.Label>
                                <Col sm="7" >
                                    <Form.Control  
                                    required
                                    type = "text"
                                    placeholder="make me a drop down"
                                    />
                                </Col>                    
                            </Form.Group>  
                        </ListGroupItem>       
                        <ListGroupItem style={{marginTop: "1%", marginBottom: "-1%"}}>               
                            <Form.Group as={Row} className="mb-3"  controlId="additionalInfo">
                            <Form.Label column sm="1" className="createAccountLabels">Info</Form.Label>
                                <Col sm="7" >
                                    <Form.Control  
                                    type = "text"
                                    placeholder="additional info"
                                    />
                                </Col>                    
                            </Form.Group>                                       
                        </ListGroupItem>
                    </ListGroup> 
                </Card.Body>
                
                </Card>
            </Form>
                <br></br>
                    <Button className="btn" variant="primary">Modify Appointment</Button>
                <br></br>
                    <Button className="btn-danger" variant="primary">Delete Appointment</Button>
                <br></br>
                <Link to="/ViewAppointments">
                    <Button className="btn" variant="primary">Cancel</Button>
                </Link>
            </div>     
        </Row> 
        </>
      );
  }
}

export default ModifyAppointment;