import React, {useState} from "react"; 
import Axios from 'axios';
import '../css/ViewAppointments.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'
import { Redirect } from 'react-router-dom';

function GenerateAppointmentList() {
    const [appointments, setAppointments] = useState([{aid: "1",a: "apple"}, {aid: "2", a: "bapple"}])
    const GenerateList = appointments.map((appointment) =>
    <>
        <br></br>
        <Card id = {appointment.aid} style={{width: '75rem' }}>
        <Card.Header>service goes here</Card.Header>
        <Card.Body>
            <Card.Title>date and time goes here</Card.Title>
            
            <ListGroup className="list-group-flush">
                <ListGroupItem>car goes here</ListGroupItem>
                <ListGroupItem>additional info</ListGroupItem>
            </ListGroup> 
        </Card.Body>
        <Button className="btn-sm" variant="primary">Modify Appointment</Button>
        </Card>
    </>
    );

    if (appointments.length > 0)
        return GenerateList
    else {
        return (
            <>
                <br></br>
                <Card style={{width: '75rem' }}>
                <Card.Header>No Upcoming Appointments</Card.Header>
                <Card.Body>
                    <Card.Title></Card.Title>
                </Card.Body>
                </Card>
            </>
        );
    }
}

class ViewAppointments extends React.Component {
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
                <GenerateAppointmentList/>
                <br></br>   
                <Link to="/Cre">
                    <Button className="btn-lg" style={{display: 'inline-block'}}>Schedule Appointment</Button>
                </Link>
            </div>     
        </Row> 
        </>
      );
  }
}

export default ViewAppointments;