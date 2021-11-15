import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/ViewAppointments.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'
import DatePicker from 'react-date-picker';

function MakeModals(props) {
    let id = props.uid
    const [validated, setValidated] = useState(false)
    const [contents, setContents] = useState({service: "", dateTime: "", vid: -1, additionalInfo: "", aid: -1});
    const [userInfo, setUserInfo] = useState({firstName: "", lastName: "", email: "", phoneNumber: ""})
    const [showing, setShowing] = useState(true)
    const [appointments, setAppointments] = useState([])
    const [userVehicles, setUserVehicles] = useState([])
    const [modifyModal, showModifyModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [dateRegex, setDateRegex] = useState("\\S*")
    const [allowSubmit,disableSubmit] = useState(false)
    const [modifyTitle, setModifyTitle] = useState("")
    const [dateError, setDateError] = useState("")

    useEffect(() => {
        // useEffect lets us fetch tables once the page is finished loading
        // TODO display a "loading appointments" message
        async function fetchTables() {
            // pull appointments table from the database
            let apps = [] // temporary array so we can set the table state later    

            if (props.filterDate !== null) {
                await Axios.post("http://localhost:3001/getAppointmentByAppId",{
                    aid: props.aid
                }).then((response) => {
                    if(response.data.err) {
                        console.log(response.data.err)
                    }
                    else if (response.data.message) {
                        console.log(response.data.err)
                    } 
                    else {     
                        // populate temporary array
                        console.log( Array(response.data.data)[0])
                        apps = Array(response.data.data)[0]
                    }
                 });
                await Axios.post("http://localhost:3001/getUser",{
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
                        let info = {
                            firstName: response.data.data[0].firstName,
                            lastName: response.data.data[0].lastName,
                            email: response.data.data[0].email,
                            phoneNumber: response.data.data[0].phoneNumber.substring(0,3)+"-"
                                            +response.data.data[0].phoneNumber.substring(3,6)+"-"
                                                +response.data.data[0].phoneNumber.substring(6,10),
                        }
                        setUserInfo(info)
                    }
            });
                
                apps = apps.filter(app => new Date(app.dateTime).valueOf() === props.filterDate)
                setShowing(false)
            }
            else {
                await Axios.post("http://localhost:3001/getUserAppointments",{
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
                        apps = Array(response.data.data)[0]
                    }
            });
            }

            console.log(apps)

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
            let userApps = apps
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
            setAppointments(userApps)
            setUserVehicles(vehicles)
        }
        fetchTables()
    }, []);
    
    const handleChange = (event) => {
        if (event.target.id === "vid")
            setContents({...contents, [event.target.id]: event.target.value})
        else
            setContents({...contents, [event.target.id]: event.target.value.trim()});
    }

    // handle card buttons
    const handleCardClick = (event) => {
        disableSubmit(false)
        setDateRegex("\\S*")   
        let mode = event.target.id.substring(0, 6) // get mode from button id
        let aid = event.target.id.substring(7, event.target.id.length) // get aid from the last portion of button id

        if (mode !== "schedu")  { // as long as we aren't scheduling a new appointment, populate contents
            let appIndex = 0;
            for (appIndex; appIndex < appointments.length; appIndex++) {
                if (appointments[appIndex].aid === Number(aid)) {
                    let temp = contents
                    temp.service = "s"+appointments[appIndex].service.substring(1,appointments[appIndex].service.length)
                    temp.dateTime = appointments[appIndex].dateTime.substring(0,10)
                    temp.vid = Number(appointments[appIndex].vid)
                    temp.additionalInfo = appointments[appIndex].additionalInfo
                    temp.aid = appointments[appIndex].aid
                    setContents(temp)
                }
            }
        }
        else // otherwise just make contents "blank"
            setContents({service: "", dateTime: "", vid: -1, additionalInfo: "", aid: -1})

        if (mode === "modify") { // both modify and schedule appointments use the same modal
            showModifyModal(true) 
            setModifyTitle("Modify Appointment")
        }
        else if (mode === "schedu") {
            showModifyModal(true)
            setModifyTitle("Schedule Appointment")
        }
        else // delete has its own special modal
            showDeleteModal(true)
    }
           
    // handle delete modal buttons
    const handleDeleteModal = (event) => {
        disableSubmit(true)
        let aid = contents.aid // get aid from contents array
        if (event.target.id === "delete_cancel")
            showDeleteModal(false) // cancel lets us just close the modal
        else { // otherwise remove the appointment from our database
            Axios.post("http://localhost:3001/deleteAppointment",{
                aid: aid
            }).then((response) => {
                if(response.data.err) 
                    console.log(response.data.err)
                else if (response.data.message) 
                    console.log(response.data.err)
                else {     
                    // remove appointment from our table
                    setAppointments(appointments.filter((appointment,index) => appointments[index].aid !== aid))
                    showDeleteModal(false)
                    Axios.get("http://localhost:3001/getAppointments",{
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.err)
                } 
                else {     
                    // populate temporary array
                    props.setApps(Array(response.data.data)[0])
                }
            });
                }
            });
        }
    }

    // handle modify modal buttons
    const handleModifyModal = async(event) => {
        if (contents.dateTime === "")
            setDateError("")
        else 
            setDateError("No appointments avaliable on this day")
        disableSubmit(true)
        let aid = contents.aid // get aid from contents array
        if (event.target.id === "modify_cancel") { // if we are canceling, just close the window
            event.preventDefault();
            showModifyModal(false)
            setValidated(false)
            
        }
        else { // if we are confirming, we have to validate the form
            const form = event.currentTarget;
            event.preventDefault();
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            setValidated(true);

            // check if form is valid
            if (form.checkValidity() === true) {
                // check if we have 4 or fewer appointments for the user's chosen day
                let appNum = 0
                await Axios.post("http://localhost:3001/getAppointmentsByDate",{
                        dateTime: contents.dateTime+" 09:00:00"
                    }).then((response) => {
                        if(response.data.err) {
                            console.log(response.data.err)
                        }
                        else if (response.data.message) {
                            console.log(response.data.err)
                        } 
                        else {     
                            appNum = response.data.length
                        }
                });
                let index = 0; // get appointment index
                for (index; index < appointments.length; index++) {
                    if (appointments[index].aid === aid)
                        break;
                } 
                // if we are one of the appointments with the date we checked, then we don't count
                if (aid !== -1 && new Date(contents.dateTime+" 09:00:00").valueOf() === new Date(appointments[index].dateTime).valueOf())
                    appNum--
                    
                // if we have less than 4 appointments on the selected day
                // and are scheduling a new appointment, populate a new appointment
                if (aid === -1 && appNum < 4) {                 
                    Axios.post("http://localhost:3001/addAppointment",{
                        uid: id,
                        vid: contents.vid,
                        dateTime: contents.dateTime+" 09:00:00",
                        service: contents.service,
                        additionalInfo: contents.additionalInfo
                    }).then((response) => {
                        if(response.data.err) {
                            console.log(response.data.err)
                        }
                        else if (response.data.message) {
                            console.log(response.data.err)
                        } 
                        else {
                            // populate appointments table
                            let newAppsTable = appointments
                            let newApp = {
                                aid: response.data.aid,
                                vid: contents.vid,
                                dateTime: contents.dateTime+" 09:00:00",
                                service: contents.service,
                                additionalInfo: contents.additionalInfo,
                                make: null,
                                model: null,
                                year: null,
                                color: null,
                                licensePlate: null
                            }
                            
                            let j = 0; // search for the vehicle that the user chose
                            for (j; j < userVehicles.length; j++) {
                                if (Number(contents.vid) === userVehicles[j].vid) {
                                    newApp.make = userVehicles[j].make
                                    newApp.model = userVehicles[j].model
                                    newApp.year = userVehicles[j].year
                                    newApp.color = userVehicles[j].color
                                    newApp.licensePlate = userVehicles[j].licensePlate
                                    break;
                                }
                            }
                            newAppsTable.push(newApp) // add new appointment to user apps table
                            setAppointments(newAppsTable) // set state
                            Axios.get("http://localhost:3001/getAppointments",{
                            }).then((response) => {
                                if(response.data.err) {
                                    console.log(response.data.err)
                                }
                                else if (response.data.message) {
                                    console.log(response.data.err)
                                } 
                                else {     
                                    // populate temporary array
                                    props.setApps(Array(response.data.data)[0])
                                }
                            });
                            setTimeout(() => {setValidated(false); showModifyModal(false);},1000); //finished, give short time delay for feedback
                        }
                    });  
                }
                else if (aid !== -1 && appNum < 4) { // modifying appointment case
                    // edit appointment
                    Axios.post("http://localhost:3001/editAppointment",{
                        aid: contents.aid,
                        vid: contents.vid,
                        dateTime: contents.dateTime+" 09:00:00",
                        service: contents.service,
                        additionalInfo: contents.additionalInfo
                    }).then((response) => {
                        if(response.data.err) {
                            console.log(response.data.err)
                        }
                        else if (response.data.message) {
                            console.log(response.data.err)
                        } 
                        else {     
                            // set user appointments table
                            
                            let newUserApps = appointments // set new appointment info
                            newUserApps[index].aid = aid
                            newUserApps[index].vid = contents.vid
                            newUserApps[index].dateTime = contents.dateTime+" 09:00:00"
                            newUserApps[index].service = contents.service
                            newUserApps[index].additionalInfo = contents.additionalInfo

                            let j = 0; // search for the vehicle that the user chose
                            for (j; j < userVehicles.length; j++) {
                                if (Number(contents.vid) === userVehicles[j].vid) {
                                    newUserApps[index].make = userVehicles[j].make
                                    newUserApps[index].model = userVehicles[j].model
                                    newUserApps[index].year = userVehicles[j].year
                                    newUserApps[index].color = userVehicles[j].color
                                    newUserApps[index].licensePlate = userVehicles[j].licensePlate
                                    break;
                                }
                            }
                            setAppointments(newUserApps) // set apps table
                            // short time delay for feedback
                            Axios.get("http://localhost:3001/getAppointments",{
                            }).then((response) => {
                                if(response.data.err) {
                                    console.log(response.data.err)
                                }
                                else if (response.data.message) {
                                    console.log(response.data.err)
                                } 
                                else {     
                                    // populate temporary array
                                    props.setApps(Array(response.data.data)[0])
                                }
                            });
                            setTimeout(() => {setValidated(false); showModifyModal(false);}, 1000);
                        }
                    });  
                }
                else {
                    // but if we have more than 4 appointments for the user's chosen day, set regex to reject it
                    setDateRegex("^(?!"+contents.dateTime+"$).*$")   
                    disableSubmit(false)
                } 
            }  
            else
                disableSubmit(false)
        }
    }

    return (
        <>    
        <br></br>
        <ListGroup className="list-group-flush" style={{ display: (showing ? 'none': 'block') }}>
            <ListGroupItem>{"Name: "+userInfo.firstName+" "+userInfo.lastName}</ListGroupItem>
            <ListGroupItem>{"Email: "+userInfo.email}</ListGroupItem>
            <ListGroupItem>{"Phone Number: "+userInfo.phoneNumber}</ListGroupItem>
        </ListGroup> 
        <Modal show={modifyModal} centered id = "modifyModal">
        <Modal.Header >
        <Modal.Title>{modifyTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p></p>
            <Form >
                <Form.Group as={Row} className="mb-3" controlId="dateTime" style = {{color: "white",position: "relative", bottom: "-125px", marginTop: "-50px"}}validated={false}>
                    <Form.Label column sm="3" className="createAccountLabels">Date</Form.Label>
                    <Col md="7" >
                        <Form.Control  
                            style = {{width: "240px", boxShadow: 'none',backgroundColor: 'rgba(0,0,0,0)', border:"0px"}}
                            type = "date"
                            min= {new Date().toISOString().slice(0, 10)}
                            value = {contents.dateTime}
                            onChange={handleChange}
                        />
                    </Col>      
                    </Form.Group> 
            </Form>
            <Form noValidate validated={validated} onSubmit={handleModifyModal}>
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
                <Form.Group as={Row} className="mb-3" controlId="dateTime">
                    <Form.Label style = {{color: 'rgba(0,0,0,0)'}} column sm="3" className="createAccountLabels">Date</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            style = {{color: 'rgba(0,0,0,0)'}}
                            value = {contents.dateTime}
                            required
                            pattern = {dateRegex}
                            type = "text"
                            placeholder=""
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">{dateError}</Form.Control.Feedback>
                    </Col>                    
                    <Form.Label style = {{marginBottom: "-5px", marginTop: "3px", marginLeft: "140px"}} className="createAccountLabels">
                        Vehicle drop off is at 9 AM</Form.Label>   
                </Form.Group>
                
                <Form.Group style = {{marginTop: "25px"}} as={Row} className="mb-3" controlId="vid">
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
                    <Button type = "submit" disabled = {allowSubmit} variant="primary" size='sm' style={{margin: '5px'}}>Confirm</Button>
                    <Button id="modify_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleModifyModal}>Cancel</Button>  
                </div>             
                                     
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
                    <Button id="delete_confir" disabled = {allowSubmit} variant="primary" size='sm' style={{margin: '5px'}} onClick={handleDeleteModal}>Confirm</Button>
                    <Button id="delete_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleDeleteModal}>Cancel</Button>
                </div>
        </Modal.Body>                   
        </Modal>
        <div >
            <GenerateAppsList appointments = {appointments} />
        </div>
        <br></br>
        <Button className="btn" id = "schedule" style={{ display: (showing ? 'inline-block' : 'none') }} onClick={handleCardClick}>Schedule Appointment</Button>
        <br></br> 
        </>
        
    );

    function GenerateAppsList(props) {
        let appointments = props.appointments
        appointments.sort(function(a,b) { // sort appointments by date
            return Number(new Date(a.dateTime) - new Date(b.dateTime))

        });
        const GenerateList = appointments.map((appointment, index) =>
            <>
            <br></br>
            <Card id = {"card_"+appointment.aid} style = {{width: window.innerWidth/4 }}>
            <Card.Header> {appointment.dateTime.substring(5,7)+"/"+appointment.dateTime.substring(8,10)
                +"/"+appointment.dateTime.substring(0,4)+" - 9 AM Drop Off"}
            </Card.Header>
            <Card.Body >
                <Card.Title>{"S"+appointment.service.substring(1,appointment.service.length)}</Card.Title>
                
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

function MakeAdminPage() {

    const [users,setUsers] = useState([])
    const [appointments, setApps] = useState([])
    const [selectedUser, setSelectedUser] = useState(-1);

    useEffect(() => {
        // useEffect lets us fetch tables once the page is finished loading
        // TODO display a "loading appointments" message
        async function fetchTables() {
            // pull user ids
            await Axios.get("http://localhost:3001/getUsers",{
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.err)
                } 
                else {     
                    // populate temporary array
                    setUsers(Array(response.data.data)[0])
                }
            });

            await Axios.get("http://localhost:3001/getAppointments",{
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.err)
                } 
                else {     
                    // populate temporary array
                    setApps(Array(response.data.data)[0])
                }
            });
        }
        fetchTables()
    }, []);

    const handleChange = (event) => {
        setSelectedUser(event.target.value)
    }

    function GenerateModals() {
        let filteredUsers = users.filter(use => use.uid === Number(selectedUser))
        const GenerateList = filteredUsers.map((user, index) =>
            <MakeModals uid = {user.uid} filterDate = {null} setApps = {setApps} Apps = {appointments}/>
        );
        return GenerateList
    }

    function GenerateModals2() {
        let date = new Date()
        date.setDate(date.getDate()+1)
        date.setHours(9,0,0,0)
        let filteredApps = appointments.filter(app => new Date(app.dateTime).valueOf() === date.valueOf()) 
        console.log(filteredApps)
        const GenerateList = filteredApps.map((app, index) =>
            <MakeModals uid = {app.uid} aid = {app.aid} filterDate = {date.valueOf()} setApps = {setApps} Apps = {appointments}/>
        );
        return GenerateList
    }

    return (
        <>
         <div>
            <label>today's appointments</label>
            <GenerateModals2 />
        </div>
        <Form>
             <Form.Group style = {{marginTop: "25px", width: "360px"}} as={Row} onChange = {handleChange} className="mb-3" controlId="dateMenu">
                    <Form.Label column sm="3" className="createAccountLabels">Customer</Form.Label>
                    <Col sm="7" >
                        <Form.Select aria-label="Default select example" className="mb-3" name="priority">
                            <option value = {-1}>Customer...</option>
                            {users.map((user) => {
                                return <option value ={user.uid}>
                                   {user.firstName+" "+user.lastName}
                                </option>;
                            })}
                        </Form.Select>
                    </Col>                           
                </Form.Group> 
        </Form>
        <div>
            <GenerateModals />
        </div>
        </>
    );
}

class ViewAppointments extends React.Component { 
    render() {
        if (this.props.role !== "admin") {
            return (
                <>
                <Row style={{padding: '1%'}}>
                    <div className="List">     
                       <MakeAdminPage/>
                    </div>     
                </Row> 
                </>
            );
        }
        else {
            return (
                <>
                <Row style={{padding: '1%'}}>
                    <div className="List">     
                        <MakeModals uid = {25}/>
                    </div>     
                </Row> 
                </>
                );
            }
    }      
}

export default ViewAppointments;