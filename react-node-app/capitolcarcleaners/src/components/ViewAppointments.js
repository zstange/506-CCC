import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/ViewAppointments.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'
import { Redirect } from 'react-router-dom';

function GenerateAppointmentList(props) {
    // assume user id is 25 for example
    let id = 25;
    //dummy appointment table

    const [appointments, setAppointments] = useState([])
    const [vehicles, setVehicles] = useState([])
    const [modal, showModal] = useState(false)
    const [modalMode, setModalMode] = useState("")
    const [modalMessage, setModalMessage] = useState("")

    useEffect(() => {
        async function fetchTables() {
            let apps = []
            let modifys = []

            await Axios.get("http://localhost:3001/getAppointmentTable",{
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.err)
                } 
                else {     
                    for (let i = 0; i < response.data.length; i++) {
                        let newItem = {
                            aid: response.data.data[i].aid,
                            uid: response.data.data[i].uid,
                            vid: response.data.data[i].vid,
                            dateTime: response.data.data[i].dateTime,
                            service: response.data.data[i].service,
                            make: null,
                            model: null,
                            year: null,
                            color: null,
                            license: null,
                            additionalInfo: response.data.data[i].additionalInfo,
                            showModifyModal: false,
                            showDeleteModal: false
                        }
                        let newModify = {show:false};
                        apps.push(newItem)
                        modifys.push(newModify)
                    } 
                    return apps    
                }
            });

            let vehic = []
        
            await Axios.post("http://localhost:3001/getVehicles",{
                uid: id
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.err)
                } 
                else {     
                    for (let i = 0; i < response.data.length; i++) {
                        let newItem = {
                            vid: response.data.data[i].vid,
                            make: response.data.data[i].make,
                            model: response.data.data[i].model,
                            year: response.data.data[i].year,
                            color: response.data.data[i].color,
                            license: response.data.data[i].licensePlate
                        }
                        vehic.push(newItem)
                    } 
                    return vehic   
                }
            });

            for (let i = 0; i < apps.length; i++) {
                for (let j = 0; j < vehic.length; j++) {
                    if (apps[i].vid === vehic[j].vid) {
                        apps[i].make = vehic[j].make
                        apps[i].model = vehic[j].model
                        apps[i].year = vehic[j].year
                        apps[i].color = vehic[j].color
                        apps[i].license = vehic[j].license
                    }
                }
                
            }

            setAppointments(apps)
            setVehicles(vehic)
        }
        fetchTables()
    }, [id]);

    const handleCardClick = (event) => {
        let mode = String(event.target.id).substring(0,6)
        let aid = String(event.target.id).substring(7,String(event.target.id).length)
        showModal(!modal)
        setModalMode(mode.charAt(0).toUpperCase() + mode.slice(1) + " Appointment")

        if (mode === "delete")
            setModalMessage("Are you sure you want to delete this appointment?")
    }

    const handleModalClick = (event) => {
        let mode = String(event.target.id).substring(0,6)
        let aid = String(event.target.id).substring(7,String(event.target.id).length)
        showModal(!modal)
        setModalMessage("")
    }

    return (
        <>
        <Modal show={modal} centered id = "modal">
        <Modal.Header >
        <Modal.Title>{modalMode}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{modalMessage}</p>
                <div style={{textAlign: 'center'}}>
                    <Button id="confirm" variant="primary" size='sm' style={{margin: '5px'}} onClick={handleModalClick}>Confirm</Button>
                    <Button id="cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleModalClick}>Cancel</Button>
                </div>
        </Modal.Body>                   
        </Modal>
        <div >
        <GenerateList appointments = {appointments} />
        </div>
        </>
    )

    function GenerateList(props) {
        let appointments = props.appointments
        const GenerateList = appointments.map((appointment, index) =>
            <>
            <br></br>
            <Card id = {"card_"+appointment.aid} >
            <Card.Header>{appointment.dateTime}</Card.Header>
            <Card.Body>
                <Card.Title>{appointment.service}</Card.Title>
                
                <ListGroup className="list-group-flush">
                    <ListGroupItem>{appointment.make+"-"+appointment.model+"-"+appointment.year+"-"+appointment.color+"-"+appointment.license}</ListGroupItem>
                    <ListGroupItem>{appointment.additionalInfo}</ListGroupItem>
                </ListGroup> 
            </Card.Body>
            <div style = {{textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>
            <Button id = {"modify-"+appointment.aid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify</Button>   
            <Button id = {"delete-"+appointment.aid} style = {{marginLeft: '5px'}} variant="danger" onClick={handleCardClick}>Delete</Button>
            </div>
            </Card>
            </>
        );
    
        return GenerateList
    }

}



class ViewAppointments extends React.Component { 

  render() {
    return (
        <>
        <Row style={{padding: '1%'}}>
            <div className="List">     
                <GenerateAppointmentList/>
                <br></br>   
                <Link to="/Cre">
                    <Button className="btn" style={{display: 'inline-block'}}>Schedule Appointment</Button>
                </Link>
            </div>     
        </Row> 
        </>
      );
  }
}

export default ViewAppointments;