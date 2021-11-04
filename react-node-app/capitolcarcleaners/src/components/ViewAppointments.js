import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/ViewAppointments.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'
import DatePicker from 'react-date-picker';

function Appointments(props) {
    // assume user id is 25 for example
    let id = 25;
    //dummy appointment table

    const [validated, setValidated] = useState(false)
    const [contents, setContents] = useState({service: "", dateTime: "", vid: -1, additionalInfo: "", aid: ""});
    const [appointmentsTable, setAppointmentsTable] = useState([])
    const [userAppointments, setUserAppointments] = useState([])
    const [userVehicles, setUserVehicles] = useState([])
    const [modifyModal, showModifyModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [dateRegex, setDateRegex] = useState("\\S*")

    useEffect(() => {
        // useEffect lets us fetch tables once the page is finished loading
        // TODO display a "loading appointments" message
        async function fetchTables() {
            // pull appointments table from the database
            let apps = [] // temporary array so we can set the table state later

            await Axios.get("http://localhost:3001/getAppointmentTable",{
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.err)
                } 
                else {     
                    // populate temporary array with data
                    // note to self: fix to not use .data.data and just .data
                    apps = Array(response.data.data)[0]
                }
            });

            // pull the user's vehicles from the database
            let vehicles = [] // temp array so we can set the state later
        
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
                    // populate temporary array
                    vehicles = Array(response.data.data)[0]
                }
            });

            // now we have to make a table of just the user's appointments
            // and populate the relevant vehicle data
            let userApps = apps.filter(appointment => appointment.uid === id)
            for (let i = 0; i < userApps.length; i++) {
                for (let j = 0; j < vehicles.length; j++) {
                    if (userApps[i].vid === vehicles[j].vid) {
                        userApps[i].make = vehicles[j].make
                        userApps[i].model = vehicles[j].model
                        userApps[i].year = vehicles[j].year
                        userApps[i].color = vehicles[j].color
                        userApps[i].licensePlate = vehicles[j].licensePlate
                    }
                }
            }
            
            // set appropriate states
            setAppointmentsTable(apps)
            setUserVehicles(vehicles)
            setUserAppointments(userApps)
        }
        fetchTables()
    }, [id]);

    const handleCardClick = (event) => {

        let mode = event.target.id.substring(0, 6)
        let aid = event.target.id.substring(7, event.target.id.length)

        if (mode !== "schedu")  {
            let appIndex = 0;
            for (appIndex; appIndex < userAppointments.length; appIndex++) {
                if (userAppointments[appIndex].aid === Number(aid)) {
                    let temp = contents
                    temp.service = "s"+userAppointments[appIndex].service.substring(1,userAppointments[appIndex].service.length)
                    temp.dateTime = userAppointments[appIndex].dateTime.substring(0,4)
                        +"-"+userAppointments[appIndex].dateTime.substring(5,7)+"-"+userAppointments[appIndex].dateTime.substring(8,10)
                    temp.vid = Number(userAppointments[appIndex].vid)
                    temp.additionalInfo = userAppointments[appIndex].additionalInfo
                    temp.aid = userAppointments[appIndex].aid
                    setContents(temp)
                }
            }
        }
        else
            setContents({service: "", dateTime: "", vid: -1, additionalInfo: "", aid: ""})

        if (mode === "modify" || mode === "schedu")
            showModifyModal(true)  
        else
            showDeleteModal(true)
        }
           

    const handleModalClick = (event) => {
        let aid = contents.aid
        if (modifyModal) {
            if (event.target.id === "modify_cancel") {
                event.preventDefault();
                showModifyModal(false)
                setValidated(false)
            }
            else { // confirm case, so we have to validate the form
                const form = event.currentTarget;
                event.preventDefault();
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                setValidated(true);

                // check if form is valid
                if (form.checkValidity() === true) {
                    // now check if chosen appointment date is okay (aka, fewer than 4 apps that day)
                    let appNum = 0
                    console.log(contents.dateTime)
                    for (let i = 0; i < appointmentsTable.length; i++) {
                        if (appointmentsTable[i].dateTime.substring(0,10) === contents.dateTime)
                            appNum++
                        if (appNum === 1) {
                            console.log("badapp")
                            setDateRegex("^(?!"+contents.dateTime+"$).*$")
                            break;
                        }    
                    }
                    if (aid === "" && appNum > 1) {
                        alert("populate with new app")
                        setTimeout(() => {setValidated(false); showModifyModal(false); }, 1000);
                    }
                    else if (appNum > 1) {
                        alert("update old app")
                        setTimeout(() => {setValidated(false); showModifyModal(false); }, 1000);
                    }
                    else {
                        console.log("change error")
                    }
                    
                    
                }  
            }
        }
        else { // delete appointment case
            if (event.target.id === "delete_cancel")
                showDeleteModal(false)
            else {
                setAppointmentsTable(appointmentsTable.filter((appointment,index) => appointmentsTable[index].aid !== aid))
                setUserAppointments(userAppointments.filter((appointment,index) => userAppointments[index].aid !== aid))
                
                alert("delete from database")
                showDeleteModal(false)
            }
        }
    }

    const handleChange = (event) => {
        if (event.target.id === "vid")
            setContents({...contents, [event.target.id]: event.target.value})
        else if (event.target.id === "dateTime") {
            let tempString = String(event.target.value)
            setContents({...contents, [event.target.id]: tempString})
        }
        else
            setContents({...contents, [event.target.id]: event.target.value.trim()});
    }

    return (
        <>    
        <Modal show={modifyModal} centered id = "modifyModal">
        <Modal.Header >
        <Modal.Title>Modify Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p></p>
            <Form noValidate validated={validated} onSubmit={handleModalClick}>
                <Form.Group as={Row} className="mb-3" controlId="service">
                    <Form.Label column sm="3" className="createAccountLabels">Service</Form.Label>
                    <Col sm="7" >
                        <Form.Select value = {contents.service} className="mb-3" required onChange={handleChange}>
                            <option value="">Select Service</option>
                            <option value="service 1">Service 1</option>
                            <option value="service 2">Service 2</option>
                            <option value="service 3">Service 3</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                    </Col>                           
                </Form.Group>  


                <Form.Group as={Row} className="mb-3" controlId="dateTime" >
                    <Form.Label column sm="3" className="createAccountLabels">Date</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            pattern = {dateRegex}
                            value = {contents.dateTime}
                            type = "date"
                            placeholder=""
                            onChange={handleChange}
                        />
                    </Col>      
                    <Form.Label style = {{marginBottom: "-5px", marginTop: "3px", marginLeft: "140px"}} className="createAccountLabels">
                        Vehicle drop off is at 9 AM</Form.Label>                 
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="dateTime">
                    <Form.Label column sm="3" className="createAccountLabels">Date REAL</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            value = {contents.dateTime}
                            required
                            pattern = {dateRegex}
                            type = "text"
                            placeholder=""
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                    </Col>                    
                </Form.Group>



                <Form.Group as={Row} className="mb-3" controlId="vid">
                    <Form.Label column sm="3" className="createAccountLabels">Vehicle</Form.Label>
                    <Col sm="7" >
                        <Form.Select value = {contents.vid} aria-label="Default select example" className="mb-3" name="priority" required onChange={handleChange}>
                            <option value = "">Select Vehicle</option>
                            {userVehicles.map((vehicle) => {
                                return <option value={vehicle.vid}>
                                    {vehicle.year+" "+vehicle.make+" "+vehicle.model+" "+vehicle.licensePlate+" "+vehicle.color}
                                </option>;
                            })}
                            
                        </Form.Select>
                        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                    </Col>                           
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="additionalInfo">
                    <Form.Label column sm="3" className="createAccountLabels">Additional Info</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            value = {contents.additionalInfo}
                            type = "text"
                            placeholder="Additional Info"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <div style={{textAlign: 'center'}}>
                    <Button type = "submit" variant="primary" size='sm' style={{margin: '5px'}}>Confirm</Button>
                    
                </div>             
                <Button id="modify_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleModalClick}>Cancel</Button>                        
            </Form>    
            
        </Modal.Body>                   
        </Modal>
        <Modal show={deleteModal} centered id = "deleteModal">
        <Modal.Header >
        <Modal.Title>Delete Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are you sure you want to delete this appointment?</p>
                <div style={{textAlign: 'center'}}>
                    <Button id="delete_confir" variant="primary" size='sm' style={{margin: '5px'}} onClick={handleModalClick}>Confirm</Button>
                    <Button id="delete_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleModalClick}>Cancel</Button>
                </div>
        </Modal.Body>                   
        </Modal>
        <div >
        <GenerateAppsList appointments = {userAppointments} />
        </div>
        <br></br>
        <Button className="btn" id = "schedule" style={{display: 'inline-block'}} onClick={handleCardClick}>Schedule Appointment</Button>
        </>
    )

    function GenerateAppsList(props) {
        let appointments = props.appointments

        const GenerateList = appointments.map((appointment, index) =>
            <>
            <br></br>
            <Card id = {"card_"+appointment.aid} style = {{width: window.innerWidth/4 }}>
            <Card.Header>{appointment.dateTime.substring(0,4)
                        +"-"+appointment.dateTime.substring(5,7)+"-"+appointment.dateTime.substring(8,10)}</Card.Header>
            <Card.Body >
                <Card.Title>{appointment.service}</Card.Title>
                
                <ListGroup className="list-group-flush">
                    <ListGroupItem>{"Vehicle: "+appointment.year+" "+appointment.make+"-"+appointment.model}</ListGroupItem>
                    <ListGroupItem>{"License Plate: "+appointment.licensePlate}</ListGroupItem>
                    <ListGroupItem>{"Color: "+appointment.color}</ListGroupItem>
                    <ListGroupItem>{"Additional Info: "+appointment.additionalInfo}</ListGroupItem>
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
                <Appointments/>
            </div>     
        </Row> 
        </>
      );
  }
}

export default ViewAppointments;