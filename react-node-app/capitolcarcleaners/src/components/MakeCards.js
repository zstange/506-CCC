import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import { useSelector } from "react-redux";
import '../css/ViewAppointments.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";

function MakeCards(props) {
  // let id = 25
  const id = props.uid
  const token = useSelector((state) => state.token.value);

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
    const [existsError, setExistsError] = useState("")
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
                }, {
                    headers: {
                        authorization: token
                    },
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
                }, {
                    headers: {
                        authorization: token
                    },
                }).then((response) => {
                    if(response.data.err) {
                        console.log(response.data.err)
                    }
                    else if (response.data.message) {
                        console.log(response.data.message)
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
            }, {
                headers: {
                    authorization: token
                },
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.message)
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
    }, [id, props.aid,props.firstName, props.lastName, props.email, props.phoneNumber, props.Apps, props.role, token]);
    
    const handleChange = (event) => {
        if (existsError === "This appointment already exists")
            setExistsError("")
        setContents({...contents, [event.target.id]: event.target.value});
    }

    // handle card buttons
    const handleCardClick = (event) => {
        disableSubmit(false)
        setDateRegex("\\S*")   
        setExistsError("")
        let mode = event.target.id.substring(0, 6) // get mode from button id
        let aid = event.target.id.substring(7, event.target.id.length) // get aid from the last portion of button id

        if (mode !== "schedu")  { // as long as we aren't scheduling a new appointment, populate contents
            let appIndex = 0;
            for (appIndex; appIndex < appointments.length; appIndex++) {
                if (appointments[appIndex].aid === Number(aid)) {
                    let temp = contents
                    temp.service = appointments[appIndex].service
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
            }, {
                headers: {
                    authorization: token
                },
            }).then((response) => {
                if(response.data.err) 
                    console.log(response.data.err)
                else if (response.data.message === "Appointement is not found!") 
                    console.log(response.data.message)
                else {     
                    if (props.role === "admin") {
                        Axios.get("http://localhost:3001/getAppointmentsAdmin", {
                            headers: {
                                authorization: token
                            },
                        }).then((response) => {
                            if(response.data.err) {
                                console.log(response.data.err)
                            }
                            else if (response.data.message) {
                                console.log(response.data.message)
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
                let changed = (appointments[0].status !== contents.status)
                if (changed) {
                    Axios.post("http://localhost:3001/editAppointment",{
                            aid: contents.aid,
                            vid: contents.vid,
                            dateTime: contents.dateTime+" 09:00:00",
                            service: contents.service,
                            additionalInfo: contents.additionalInfo,
                            status: contents.status
                        }, {
                            headers: {
                                authorization: token
                            },
                        }).then((response) => {
                            if(response.data.err) {
                                console.log(response.data.err)
                            }
                            else if (response.data.message === "Appointement is not found!") {
                                console.log(response.data.message)
                            } 
                            else { 
                                if (contents.status === "Ready") {
                                    let j = 0; // search for the vehicle that the user chose
                                    let car
                                    for (j; j < userVehicles.length; j++) {
                                        if (Number(contents.vid) === userVehicles[j].vid) {
                                            car = userVehicles[j].color+" "+userVehicles[j].year+" "+userVehicles[j].make
                                                    +" "+userVehicles[j].model
                                            break;
                                        }
                                    }
                                    let date = contents.dateTime.substring(5,7)+"/"+contents.dateTime.substring(8,10)
                                        +"/"+contents.dateTime.substring(0,4)
                                    Axios.post("http://localhost:3001/sendVehicle",{
                                        email: userInfo.email,
                                        message: "This is a courtesy email to let you know your vehicle dropped off on "+date+" is now ready for pickup.\n"
                                            +"\nVehicle: "+car+"\nLicense Plate: "+userVehicles[j].licensePlate+"\nService: "+contents.service+"\n\nContact Us:\nWest Towne Location - "
                                            +"6802 Watts Rd. Madison, WI 53719\nPhone: 608-271-4419"
                                            +"\nEast Towne Location - 4102 Lien Rd. Madison, WI 53704\nPhone: 608-630-8327"
                                    }, {
                                        headers: {
                                            authorization: token
                                        },
                                    }).then((response) => {
                                        if(response.data.err) {
                                            console.log(response.data.err)
                                            alert("Pick up email not sent")
                                        }
                                        else if (response.data.message) {
                                            console.log(response.data.message)
                                            alert("Pick up email not sent")
                                        } 
                                        else
                                            alert("Pick up email sent")
                                    });
                                }   
                                Axios.get("http://localhost:3001/getAppointmentsAdmin", {
                                        headers: {
                                            authorization: token
                                        },
                                    }).then((response) => {
                                        if(response.data.err) {
                                            console.log(response.data.err)
                                        }
                                        else if (response.data.message) {
                                            console.log(response.data.message)
                                        } 
                                        else {     
                                            // populate temporary array
                                            setTimeout(() => {props.setApps(Array(response.data.data)[0]); setValidated(false); showStatusModal(false); }, 1000);  
                                        }
                                });
                            }
                    });
                }
                else 
                setTimeout(() => {setValidatedStatus(false); showStatusModal(false);}, 1000); 
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
                    }, {
                        headers: {
                            authorization: token
                        },
                    }).then((response) => {
                        if(response.data.err) {
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

                if (aid === -1 && appNum < 4) { // add appointment case
                    let exists = false;
                    await Axios.post("http://localhost:3001/getAppointmentsByInfo",{
                            vid: contents.vid,
                            dateTime: contents.dateTime+" 09:00:00",
                            service: contents.service
                        }, {
                            headers: {
                                authorization: token
                            },
                        }).then((response) => {
                            if(response.data.err) {
                                console.log(response.data.err)
                            }
                            else {     
                                exists = Array(response.data.data)[0]
                            }
                    });   
                    if (!exists) {
                        await Axios.post("http://localhost:3001/addAppointment",{
                        uid: id,
                        vid: contents.vid,
                        dateTime: contents.dateTime+" 09:00:00",
                        service: contents.service,
                        additionalInfo: contents.additionalInfo,
                        status: tempStatus
                        }, {
                            headers: {
                                authorization: token
                            },
                        }).then((response) => {
                            if(response.data.err) {
                                console.log(response.data.err)
                            }
                            else {
                                if (props.role === "admin") {
                                    setTimeout(() => {setValidated(false); showModifyModal(false);
                                        Axios.get("http://localhost:3001/getAppointmentsAdmin", {
                                            headers: {
                                                authorization: token
                                            },
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
                        }, {
                            headers: {
                                authorization: token
                            },
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
                    else {
                        setValidated(false)
                        disableSubmit(false)
                        setExistsError("This appointment already exists")
                    }      
                    
                }
                else if (aid !== -1 && appNum < 4) { // modifying appointment case
                    // edit appointment
                    let changed = (Number(appointments[index].vid) !== Number(contents.vid) || new Date(appointments[index].dateTime).getTime() !== new Date(contents.dateTime + " 09:00:00").getTime()
                        || appointments[index].service !== contents.service || appointments[index].additionalInfo !== contents.additionalInfo
                        || appointments[index].status !== contents.status)
                    if (changed) {
                        let exists = false;
                        await Axios.post("http://localhost:3001/getAppointmentsByInfo",{
                                vid: contents.vid,
                                dateTime: contents.dateTime+" 09:00:00",
                                service: contents.service
                            }, {
                                headers: {
                                    authorization: token
                                },
                            }).then((response) => {
                                if(response.data.err) {
                                    console.log(response.data.err)
                                }
                                else {     
                                    exists = Array(response.data.data)[0]
                                }
                        });   
                        let newInfoOrStatus = (Number(appointments[index].vid) === Number(contents.vid) && new Date(appointments[index].dateTime).getTime() === new Date(contents.dateTime + " 09:00:00").getTime()
                        && appointments[index].service === contents.service && (appointments[index].additionalInfo !== contents.additionalInfo
                        || appointments[index].status !== contents.status))
                        if (!exists || newInfoOrStatus) {
                            Axios.post("http://localhost:3001/editAppointment",{
                            aid: contents.aid,
                            vid: contents.vid,
                            dateTime: contents.dateTime+" 09:00:00",
                            service: contents.service,
                            additionalInfo: contents.additionalInfo,
                            status: contents.status
                            }, {
                                headers: {
                                    authorization: token
                                },
                            }).then((response) => {
                                if(response.data.err) {
                                    console.log(response.data.err)
                                }
                                else if (response.data.message === "appointment doesn't exist in the table.") {
                                    console.log(response.data.message)
                                } 
                                else {       
                                    if (props.role === "admin") {
                                        if (contents.status === "Ready") {
                                            let j = 0; // search for the vehicle that the user chose
                                            let car
                                            for (j; j < userVehicles.length; j++) {
                                                if (Number(contents.vid) === userVehicles[j].vid) {
                                                    car = userVehicles[j].color+" "+userVehicles[j].year+" "+userVehicles[j].make
                                                            +" "+userVehicles[j].model
                                                    break;
                                                }
                                            }
                                            let date = contents.dateTime.substring(5,7)+"/"+contents.dateTime.substring(8,10)
                                                +"/"+contents.dateTime.substring(0,4)
                                            Axios.post("http://localhost:3001/sendVehicle",{
                                                email: userInfo.email,
                                                message: "This is a courtesy email to let you know your vehicle dropped off on "+date+" is now ready for pickup.\n"
                                                    +"\nVehicle: "+car+"\nLicense Plate: "+userVehicles[j].licensePlate+"\nService: "+contents.service+"\n\nContact Us:\nWest Towne Location - "
                                                    +"6802 Watts Rd. Madison, WI 53719\nPhone: 608-271-4419"
                                                    +"\nEast Towne Location - 4102 Lien Rd. Madison, WI 53704\nPhone: 608-630-8327"
                                            }, {
                                                headers: {
                                                    authorization: token
                                                },
                                            }).then((response) => {
                                                if(response.data.err) {
                                                    console.log(response.data.err)
                                                    alert("Pick up email not sent")
                                                }
                                                else if (response.data.message) {
                                                    console.log(response.data.message)
                                                    alert("Pick up email not sent")
                                                } 
                                                else
                                                    alert("Pick up email sent")
                                            });
                                        }   
                                            Axios.get("http://localhost:3001/getAppointmentsAdmin", {
                                                headers: {
                                                    authorization: token
                                                },
                                                }).then((response) => {
                                                if(response.data.err) {
                                                    console.log(response.data.err)
                                                }
                                                else if (response.data.message) {
                                                    console.log(response.data.message)
                                                } 
                                                else {     
                                                    // populate temporary array
                                                    props.setApps(Array(response.data.data)[0])
                                                }
                                            });   
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
                            setValidated(false)
                            disableSubmit(false)
                            setExistsError("This appointment already exists")
                        }
                    }
                    else
                        setTimeout(() => {setValidated(false); showModifyModal(false);}, 1000);
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
                            <option value="Complete Auto Detailing">Complete Auto Detailing</option>
                            <option value="Interior Cleaning">Interior Cleaning</option>
                            <option value="Exterior Cleaning">Exterior Cleaning</option>
                            <option value="Odor Removal">Odor Removal</option>
                            <option value="Rust Proofing">Rust Proofing</option>
                            <option value="Ceramic Coating">Ceramic Coating</option>
                            <option value="Ceramic Coating">Motorcycle Detailing</option>
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
                <div style={{ display: (showAdminInfo && modifyTitle !== "Schedule Appointment" ? 'block': 'none') ,textAlign: 'center'}}> 
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
                <div>
                    <Form.Label style = {{color: "red", display: 'block', marginTop:"-25px",textAlign: 'center'}}>{existsError}</Form.Label>  
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
                <Card.Title>{appointment.service}</Card.Title>
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
            <div style = {{display: (showStatus ? 'none': 'block'), textAlign: 'center', marginTop: '-5px', marginBottom: '15px'}}>
                <Button id = {"modify-"+appointment.aid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify</Button>   
                <Button id = {"delete-"+appointment.aid} style = {{marginLeft: '5px'}} variant="danger" onClick={handleCardClick}>Delete</Button>
            </div>
            <div style = {{display: (showStatus ? 'block': 'none'), textAlign: 'center', marginTop: '-5px', marginBottom: '15px'}}>
                <Button id = {"status-"+appointment.aid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify Status</Button>   
            </div>
            </Card>
            </>
        );
        return <div className = "grid" >{appointments.map(GenerateList)}</div>
    }
}

export default MakeCards;