import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/ViewAppointments.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";

function MakeCards(props) {
    let id = props.uid
    const [validated, setValidated] = useState(false)
    const [validatedStatus, setValidatedStatus] = useState(false)
    const [contents, setContents] = useState({service: "", dateTime: "", vid: -1, additionalInfo: "", aid: -1, status: ""});
    const [userInfo, setUserInfo] = useState({firstName: "", lastName: "", email: "", phoneNumber: ""})
    const [showAdminInfo, setShowingAdmin] = useState(false)
    const [showStatus, setShowStatus] = useState(false)
    const [appointments, setAppointments] = useState([])
    const [userVehicles, setUserVehicles] = useState([])
    const [modifyModal, showModifyModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [dateRegex, setDateRegex] = useState("\\S*")
    const [allowSubmit,disableSubmit] = useState(false)
    const [modifyTitle, setModifyTitle] = useState("")
    const [dateError, setDateError] = useState("")
    const [ready, setReady] = useState(false)
    const [statusModal, showStatusModal] = useState(false)

    useEffect(() => { 
        // useEffect lets us fetch tables once the page is finished loading
        async function fetchTables() {
            // pull appointments table from the database
            let apps = [] // temporary array so we can set the table state later    

            // if we were given an aid, that means we should fill the appointments table with only that single appointment
            if (props.aid !== null) { 
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
                        apps = Array(response.data.data)[0]
                    }
                });
                
                setShowStatus(true)
            }
            else { // otherwise just fill the appointments table with all the user's appointments
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
            
            if (props.role === "admin") {
                setShowingAdmin(true)
                setUserInfo({firstName: props.firstName, lastName: props.lastName, email: props.email, phoneNumber: props.phoneNumber})
            }
            else {
                apps = apps.filter(app => app.status !== "Picked Up")
            }
                

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
            
            setReady(true)
        }
        fetchTables()
    }, [id, props.aid,props.firstName, props.lastName, props.email, props.phoneNumber, props.Apps, props.role]);
    
    const handleChange = (event) => {
        if (event.target.id === "vid")
            setContents({...contents, [event.target.id]: event.target.value})
        else
            setContents({...contents, [event.target.id]: event.target.value});
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
                    contents.status = appointments[appIndex].status
                    setContents(temp)
                }
            }
        }
        else // otherwise just make contents "blank"
            setContents({service: "", dateTime: "", vid: -1, additionalInfo: "", aid: -1, status: "Not Ready"})

        if (mode === "modify") { // both modify and schedule appointments use the same modal
            showModifyModal(true) 
            setModifyTitle("Modify Appointment")
        }
        else if (mode === "schedu") {
            showModifyModal(true)
            setModifyTitle("Schedule Appointment")
        }
        else if (mode === "delete")// delete has its own special modal
            showDeleteModal(true)
        else // status modal 
            showStatusModal(true)
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
                    if (props.role === "admin") {
                        Axios.get("http://localhost:3001/getAppointmentsAdmin",{
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
                    // remove appointment from our table
                    setAppointments(appointments.filter((appointment,index) => appointments[index].aid !== aid))
                    showDeleteModal(false)
                }
            });
        }
    }

    // handle status modal buttons
    const handleStatusModal = (event) => {
        disableSubmit(true)
        if (event.target.id === "status_cancel") {
            showStatusModal(false) // cancel lets us just close the modal
            setValidatedStatus(false)
        }
        else {
            event.preventDefault();
            setValidatedStatus(true)

            if (event.currentTarget.checkValidity() === true) {
                
                Axios.post("http://localhost:3001/editAppointment",{
                            aid: contents.aid,
                            vid: contents.vid,
                            dateTime: contents.dateTime+" 09:00:00",
                            service: contents.service,
                            additionalInfo: contents.additionalInfo,
                            status: contents.status
                        }).then((response) => {
                            if(response.data.err) {
                                console.log(response.data.err)
                            }
                            else if (response.data.message) {
                                console.log(response.data.err)
                            } 
                            else { 
                                if (contents.status === "Picked Up") 
                                    alert("insert email notif to customer here") // TODO - ADD EMAIL NOTIFS
                                setTimeout(() => {setValidated(false); showStatusModal(false); 
                                    Axios.get("http://localhost:3001/getAppointmentsAdmin",{
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
                                }, 1000);  
                            }
                });
            }
            else 
                disableSubmit(false)
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
                            appNum = (Array(response.data.data)[0].filter(app => app.status !== "Picked Up")).length
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
                // if we are a picked up appointment, we also don't count.
                if (contents.status === "Picked Up")
                    appNum--
                    
                // if we have less than 4 appointments on the selected day
                // and are scheduling a new appointment, populate a new appointment
                let tempStatus
                if (props.role === "admin") 
                    tempStatus = contents.status
                else
                    tempStatus = "Not Ready"

                if (aid === -1 && appNum < 4) {                 
                    await Axios.post("http://localhost:3001/addAppointment",{
                        uid: id,
                        vid: contents.vid,
                        dateTime: contents.dateTime+" 09:00:00",
                        service: contents.service,
                        additionalInfo: contents.additionalInfo,
                        status: tempStatus
                    }).then((response) => {
                        if(response.data.err) {
                            console.log(response.data.err)
                        }
                        else if (response.data.message) {
                            console.log(response.data.err)
                        } 
                        else {
                            if (props.role === "admin") {
                                setTimeout(() => {setValidated(false); showModifyModal(false);
                                    Axios.get("http://localhost:3001/getAppointmentsAdmin",{
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
                                },1000);                       
                            }
                        }
                    });  

                    // populate appointments table
                    let newApps = []
                    await Axios.post("http://localhost:3001/getUserAppointments",{ // get aid of latest appointment
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
                            newApps = Array(response.data.data)[0]
                        }    
                    });
                    let newAppsTable = appointments
                    let newApp = {
                        aid: newApps[newApps.length-1].aid,
                        vid: contents.vid,
                        dateTime: contents.dateTime+" 09:00:00",
                        service: contents.service,
                        additionalInfo: contents.additionalInfo,
                        status: contents.status,
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
                    
                    setTimeout(() => {setValidated(false); showModifyModal(false);},1000); //finished, give short time delay for feedback
                }
                else if (aid !== -1 && appNum < 4) { // modifying appointment case
                    // edit appointment
                    Axios.post("http://localhost:3001/editAppointment",{
                        aid: contents.aid,
                        vid: contents.vid,
                        dateTime: contents.dateTime+" 09:00:00",
                        service: contents.service,
                        additionalInfo: contents.additionalInfo,
                        status: contents.status
                    }).then((response) => {
                        if(response.data.err) {
                            console.log(response.data.err)
                        }
                        else if (response.data.message) {
                            console.log(response.data.err)
                        } 
                        else {     
                            if (contents.status === "Picked Up") 
                                alert("insert email notif to customer here") // TODO - ADD EMAIL NOTIFS
                            if (props.role === "admin") {
                                setTimeout(() => {setValidated(false); showModifyModal(false);
                                    Axios.get("http://localhost:3001/getAppointmentsAdmin",{
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
                                }, 1000);   
                            }
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

    if (!ready) {
        return (
            null
        )
    }

    let date = new Date()
    date.setHours(0,0,0,0)
    date = date.toISOString().slice(0, 10)
    return (
        
        <>    
        <div>
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
                            min= {date}
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
                <div style={{ display: (showAdminInfo ? 'block': 'none') ,textAlign: 'center'}}> 
                <Form.Group as={Row} className="mb-3" controlId="status">
                    <Form.Label column sm="3" className="createAccountLabels">Status</Form.Label>
                    <Col sm="7" >
                        <Form.Select value = {contents.status} className="mb-3" required onChange={handleChange}>
                            <option value="">Select Status</option>
                            <option value="Not Ready">Not Ready</option>
                            <option value="Ready">Ready</option>
                            <option value="Picked Up">Picked up</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                    </Col>                           
                </Form.Group>
                </div>
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

        <Modal show={statusModal} centered id = "statusModal">
        <Modal.Header >
        <Modal.Title>Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Set Appointment Status</p>
            <p></p>
            <Form noValidate validated={validatedStatus} onSubmit={handleStatusModal}>
                <Form.Group as={Row} className="mb-3" controlId="status">
                    <Form.Label column sm="3" className="createAccountLabels">Status</Form.Label>
                    <Col sm="7" >
                        <Form.Select value = {contents.status} className="mb-3" required onChange={handleChange}>
                            <option value="">Select Status</option>
                            <option value="Not Ready">Not Ready</option>
                            <option value="Ready">Ready</option>
                            <option value="Picked Up">Picked up</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                    </Col>                           
                </Form.Group>  
                <div style={{textAlign: 'center'}}>
                    <Button type = "submit" disabled = {allowSubmit} variant="primary" size='sm' style={{margin: '5px'}}>Confirm</Button>
                    <Button id="status_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleStatusModal}>Cancel</Button>  
                </div>             
                                     
            </Form>   
        </Modal.Body>                   
        </Modal>                   
        <div className = "List" style ={{display: (showStatus || !showAdminInfo ? 'none':'block'),margin:"auto", marginBottom:"-25px",fontSize:"20px",width: window.innerWidth/4}}>
        <ListGroup >
            <ListGroupItem>{"Name: "+userInfo.firstName+" "+userInfo.lastName}</ListGroupItem>
            <ListGroupItem>{"Email: "+userInfo.email}</ListGroupItem>
            <ListGroupItem>{"Phone Number: "+userInfo.phoneNumber}</ListGroupItem>
        </ListGroup> 
        </div>
        <div >
            <GenerateAppsList appointments = {appointments} />
        </div>
        <br></br>
        <Button className="btn " id = "schedule" style={{ display: (showStatus ? 'none':'block'), margin:"auto"}} onClick={handleCardClick}>Schedule Appointment</Button>
        
        </div>
        </>
        
    );

    function GenerateAppsList(props) {
        let appointments = props.appointments
        appointments.sort(function(a,b) { // sort appointments by date
            return Number(new Date(a.dateTime) - new Date(b.dateTime))

        });
        const GenerateList = ((appointment, index) =>
            <>
            <Card id = {"card_"+appointment.aid} style = {{width: window.innerWidth/4, margin:"15px"}} className = "box">
            <Card.Header> {appointment.dateTime.substring(5,7)+"/"+appointment.dateTime.substring(8,10)
                +"/"+appointment.dateTime.substring(0,4)+" - 9 AM Drop Off"}
            </Card.Header>
            <Card.Header> {"Status: "+appointment.status}
            </Card.Header>
            <Card.Body >
                <Card.Title>{"S"+appointment.service.substring(1,appointment.service.length)}</Card.Title>
                <ListGroup className="list-group-flush" style={{display: (showStatus ? 'block':'none'), margin:"auto", justifyContent:"center"}}>
                    <ListGroupItem>{"Name: "+userInfo.firstName+" "+userInfo.lastName}</ListGroupItem>
                    <ListGroupItem>{"Email: "+userInfo.email}</ListGroupItem>
                    <ListGroupItem>{"Phone Number: "+userInfo.phoneNumber}</ListGroupItem>
                    <ListGroupItem></ListGroupItem>
                </ListGroup> 
                <ListGroup className="list-group-flush">
                    <ListGroupItem>{"Vehicle: "+appointment.year+" "+appointment.make+"-"+appointment.model}</ListGroupItem>
                    <ListGroupItem>{"License Plate: "+appointment.licensePlate}</ListGroupItem>
                    <ListGroupItem>{"Color: "+appointment.color}</ListGroupItem>
                    <ListGroupItem>{"Additional Info: "+appointment.additionalInfo}</ListGroupItem>
                </ListGroup> 
            </Card.Body>
            <div style = {{display: (showStatus ? 'none': 'block'), textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>
                <Button id = {"modify-"+appointment.aid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify</Button>   
                <Button id = {"delete-"+appointment.aid} style = {{marginLeft: '5px'}} variant="danger" onClick={handleCardClick}>Delete</Button>
            </div>
            <div style = {{display: (showStatus ? 'block': 'none'), textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>
                <Button id = {"status-"+appointment.aid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify Status</Button>   
            </div>
            </Card>
            </>
        );
        return <div className = "grid" >{appointments.map(GenerateList)}</div>
    }
}

function MakeAdminPage() {


    const [appointments, setApps] = useState([])
    const [users,setUsers] = useState([])
    const [ready,setReady] = useState(false)

    useEffect(() => {
        // useEffect lets us fetch tables once the page is finished loading
        async function fetchTables() {
            await Axios.get("http://localhost:3001/getAppointmentsAdmin",{
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
        }
        fetchTables()
        setReady(true)
    }, []);

    function GenerateTodaysModals() {
        let date = new Date()
        date.setHours(9,0,0,0)
        // filter appointments table to only show the ones on today's date at 9 am (9 am is hardcoded as the drop off time)
        let filteredApps = appointments.filter(app => new Date(app.dateTime).valueOf() === date.valueOf() && app.status !== "Picked Up") 

        // create a card for each filtered appointment and give it the user info
        const GenerateList = ((app, index) =>
            <MakeCards uid = {app.uid} firstName = {app.firstName} lastName = {app.lastName} email = {app.email} 
               phoneNumber = {app.phoneNumber} aid = {app.aid} setApps = {setApps} Apps = {appointments} role = {"admin"}/>
        );

        if (filteredApps.length === 0) { // if we don't have any appointments today just return a message saying so
            return (
                <div style={{marginBottom: "25px"}}>
                     <ListGroup className="list-group-flush">
                        <ListGroupItem></ListGroupItem>
                        <ListGroupItem style = {{fontSize: "20px"}}>No Appointments Today...</ListGroupItem>
                        <ListGroupItem></ListGroupItem>
                    </ListGroup> 
                </div>
            );
        }
        else { // otherwise populate each appointment with its user info
            for (let i = 0; i < filteredApps.length; i++) {
                for (let j = 0; j < users.length; j++) {
                    if (filteredApps[i].uid === users[j].uid) {
                        filteredApps[i].firstName = users[j].firstName
                        filteredApps[i].lastName = users[j].lastName
                        filteredApps[i].email = users[j].email
                        filteredApps[i].phoneNumber = users[j].phoneNumber
                    }
                }
            }
            return <div className = "grid" >{filteredApps.map(GenerateList)}</div> // then generate the appointment cards
        }
    }

    // render the today's appointments list and customer appointments list
    // note that the customer list requires its own function so that when a customer is selected
    // it doesn't rerender the today's appointment list
    // also note that they both use the same appointments table so changing its state will cause both rerender
    if (ready) {
        return (
            <>
            <br></br>
            <label className="TodayHeader">Today's Appointments</label>
            <br></br>
            <div>
                <GenerateTodaysModals/> 
            </div>
            <label className="AllAppHeader">All Customer Appointments</label>
            <div>
                <MakeCustomerApps setApps = {setApps} appointments = {appointments} users = {users}/>
            </div>
            </>
        );
    }
    else {
        return (
          <label>loading...</label>  
        );
    }
    
}

function MakeCustomerApps(props) {
    const [selectedUser, setSelectedUser] = useState(-1);
    const handleChange = (event) => {
        setSelectedUser(event.target.value)
    }
    function GenerateCustomerModals() {
        let filteredUsers = props.users.filter(use => use.uid === Number(selectedUser)) // filter users array by selected user
        const GenerateList = filteredUsers.map((user, index) =>
            <MakeCards uid = {user.uid} aid = {null} setApps = {props.setApps} Apps = {props.appointments} role = {"admin"}
            firstName = {user.firstName} lastName = {user.lastName} email = {user.email}  phoneNumber = {user.phoneNumber}/>
        );
        return GenerateList
    }
    
    return (
        <>      
        <br></br>
        <Form>
             <Form.Group style = {{width: "360px", margin:"auto", fontSize:"22px"}} as={Row} onChange = {handleChange} className="mb-3" controlId="dateMenu">
                    <Form.Label column sm="3" className="createAccountLabels">Customer</Form.Label>
                    <Col sm="8" >
                        <Form.Select style = {{marginLeft:"20px",fontSize:"18px"}} aria-label="Default select example" className="mb-3" name="priority">
                            <option value = {-1}>Customer...</option>
                            {props.users.map((user) => {
                                return <option value ={user.uid}>
                                   {user.firstName+" "+user.lastName}
                                </option>;
                            })}
                        </Form.Select>
                    </Col>                           
                </Form.Group> 
        </Form>
        <div>
            <GenerateCustomerModals/>
        </div>
        </>
    )
}

class ViewAppointments extends React.Component { 

    render() {
        if (this.props.role === "admin") { // role check
            return (
                <>
                <Row style={{padding: '1%'}}>
                    <div className = "List">     
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
                    <div className="Grid">     
                        <MakeCards uid = {this.props.uid} aid = {null} role = {"user"}/>
                    </div>     
                </Row> 
                </>
            );
        }
    }      
}

export default ViewAppointments;