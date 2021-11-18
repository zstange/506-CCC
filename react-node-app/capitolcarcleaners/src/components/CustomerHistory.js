import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/CustomerHistory.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";

function MakeCards(props) {
    let id = props.uid
    const [userInfo, setUserInfo] = useState({firstName: "", lastName: "", email: "", phoneNumber: ""})
    const [showAdminInfo, setShowingAdmin] = useState(false)
    const [appointments, setAppointments] = useState([])
    const [ready, setReady] = useState(false)

    useEffect(() => { 
        // useEffect lets us fetch tables once the page is finished loading
        async function fetchTables() {
            // pull appointments table from the database
            let apps = [] // temporary array so we can set the table state later    

            // if we were given an aid, that means we should fill the appointments table with only that single appointment
            
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
                        apps = apps.filter(app => app.status === "Picked Up")
                    }    
            });
            
            if (props.role === "admin") {
                setShowingAdmin(true)
                setUserInfo({firstName: props.firstName, lastName: props.lastName, email: props.email, phoneNumber: props.phoneNumber})
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
            
            setReady(true)
        }
        fetchTables()
    }, [id, props.aid,props.firstName, props.lastName, props.email, props.phoneNumber, props.Apps, props.role]);

    if (!ready) {
        return (
            null
        )
    }

    return (
        
        <>                 
        <div className = "List" style ={{display: (showAdminInfo ? 'block':'none'),margin:"auto", marginBottom:"-25px",fontSize:"20px",width: window.innerWidth/4}}>
        <ListGroup >
            <ListGroupItem>{"Name: "+userInfo.firstName+" "+userInfo.lastName}</ListGroupItem>
            <ListGroupItem>{"Email: "+userInfo.email}</ListGroupItem>
            <ListGroupItem>{"Phone Number: "+userInfo.phoneNumber}</ListGroupItem>
        </ListGroup> 
        <br></br>
        </div>
        <div >
            <GenerateAppsList appointments = {appointments} />
        </div>
        <br></br>
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
            <Card.Body >
                <Card.Title>{"S"+appointment.service.substring(1,appointment.service.length)}</Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>{"Vehicle: "+appointment.year+" "+appointment.make+"-"+appointment.model}</ListGroupItem>
                    <ListGroupItem>{"License Plate: "+appointment.licensePlate}</ListGroupItem>
                    <ListGroupItem>{"Color: "+appointment.color}</ListGroupItem>
                    <ListGroupItem>{"Additional Info: "+appointment.additionalInfo}</ListGroupItem>
                </ListGroup> 
            </Card.Body>
            </Card>
            </>
        );
        return <div className = "List" >{appointments.map(GenerateList)}</div>
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

    // render the today's appointments list and customer appointments list
    // note that the customer list requires its own function so that when a customer is selected
    // it doesn't rerender the today's appointment list
    // also note that they both use the same appointments table so changing its state will cause both rerender
    if (ready) {
        return (
            <>
            <br></br>
            <label className="AllAppHeader">Customer History</label>
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

class CustomerHistory extends React.Component { 
    render() {
        if (this.props.role !== "admin") { // role check
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
                    <div className="List">     
                        <MakeCards uid = {this.props.uid} aid = {null} role = {"user"}/>
                    </div>     
                </Row> 
                </>
            );
        }
    }      
}

export default CustomerHistory;