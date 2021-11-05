import React, {useState} from "react";
import "../css/CustomerHomepage.css"
import Calendar from "../components/Calendar"
import Axios from 'axios';
import { Form, Card, Button, Row, Col, Modal } from "react-bootstrap";

/*
 * Do we need a spot to change the option to receive promotions (true/false)?
 */


async function fetchVehicles() {
    var vehicles = [];
    
    await Axios.get("http://localhost:3001/getVehicles",{

    }).then((response) => {
        if(response.data.err) {
            console.log(response.data.err)
        }
        else if (response.data.message) {
            console.log(response.data.err)
        } 
        else {     
            // populate vehicle array with data
            console.log(response.data)
            vehicles.push(response.data) // probably not correct
        }
    });

    return vehicles;
}

/*
 *  Vehicles() pulls the current user's vehicles that they have added to their acount.
 *  If there are no vehicles to display, a message is displayed saying so. Otherwise,
 *  it displays all vehicles.
 */
function Vehicles() {
    const [modal, showModal] = useState(false);

    //var vehicleList = fetchVehicles(UID);

    // Get the number of Vehicles the user has added to their account
    // Iterate through the vehicleList pulling there info
    // If 0 vehicles added then display no vehicles

    // if(vehicleList == 0){
    //     return (
    //         <>
    //             <p>
    //                 No vehicles have been added to your account.
    //             </p>
    //         </>
    //     )
    // }

    // will need a way to iterate over all vehicles add to the user's account
    // for(let i = 0, i < numVehicles; i++) { <return statement here> }
    return (
        <>
            <Row>
                <Card style={{ width: '18rem', marginLeft: '10px', marginTop: '10px' }}>
                    <Card.Img variant="top" src="/CarLogo.png" />
                    <Card.Body>
                        <Card.Title>GET MAKE</Card.Title>
                        <Card.Text>
                        Date of last detailing: 
                        <br />
                        </Card.Text>
                        <div style={{textAlign: 'center'}}>
                            <Button variant="danger" onClick={() => showModal(true)}>Delete Vehicle</Button>
                            <Modal
                                show={modal}
                                onHide={() => showModal(false)}
                                centered
                                backdrop="static"
                            >
                                <Modal.Header >
                                    <Modal.Title>Delete Vehicle</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <p>Are you sure you want to remove this vehicle?</p>
                                    <div style={{textAlign: 'center'}}>
                                        {/* this needs to then call the backend to update if confirm is selected */}
                                        <Button variant="primary" size='sm' style={{margin: '5px'}} onClick={() => showModal(false)}>Confirm</Button> 
                                        <Button variant="secondary" size='sm' style={{margin: '5px'}} onClick={() => showModal(false)}>Cancel</Button>
                                    </div>
                                </Modal.Body>                   
                            </Modal>
                        </div>
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
}

/*
 * AddVehicles() will allow a user to add vehicles to their account. On submission, a call to store the 
 * data in our DB should be made as well as a page refresh to display the newly added vehcile.
 */
function AddVehicles() {
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event) => {

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }
        
        setValidated(true);

        // Output Caputured Data
        if (form.checkValidity() === true) {
            console.log("success")
            // Send info to data base
            // Refresh accout home to display the new vehicle added
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
                    <div style={{textAlign: 'center'}}>
                        <Button className="m-4" type="submit" style={{display: 'inline-block'}}>Submit</Button>  
                    </div>
                </Form>        
            </div>     
            </Row> 
        </>
    )
}

class CustomerHomepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddVehicle: false,
            showAddAppointment: false,
            showEditAppointment: false,
            showDeleteAppointment: false, // Not sure if needed
            selectedDate: null,
            
        };
        this.setClickedDate = this.setClickedDate.bind(this)
      } 

    getFirstName() {
        // fetches username from DB
        var firstName = "TEST First Name";
        return firstName
    }

    getLastName() {
        // fetches username from DB
        var lastName = "TEST Last Name";
        return lastName
    }

    getEmail() {
        // fetches email from DB
        var email = "TEST Email";
        return email
    }

    getPhoneNumber() {
        // fetches phone Number from DB
        var pNum = "TEST XXX-XXX-XXXX";
        return pNum
    }

    openAddVehicle() {
        this.setState({ showAddVehicle: true });
    }

    closeAddVehicle() {
        this.setState({ showAddVehicle: false });
    }

    openAddAppointment() {
        this.setState({ showAddAppointment: true });
    }

    closeAddAppointment() {
        this.setState({ showAddAppointment: false });
    }

    openEditAppointment() {
        this.setState({ showEditAppointment: true });
    }

    closeEditAppointment() {
        this.setState({ showEditAppointment: false });
    }

    openDeleteAppointment() {
        this.setState({ showDeleteAppointment: true });
    }

    closeDeleteAppointment() {
        this.setState({ showDeleteAppointment: false });
    }

    async setClickedDate(date) {
        // Might need to convert the Date from a JSON Object to a string?
        this.setState({selectedDate: date})
    }

    render() {
        return (
            <>
                <div style={{marginBottom: '10px'}}>
                    <Row>
                        <h1>Welcome, {this.getFirstName()}</h1>                                         
                    </Row>
                </div> 

                <Row style={{justifyContent: 'center'}}>
                    <div className="col-lg-4 col-xs-5 mx-4">
                        {/* Account Info Section */}
                        <div className="border p-3">
                            <h3 className="sectionAccTitle">Account Information:</h3>
                            <hr 
                                style= {{
                                    height: 5, 
                                    width: "100%", 
                                    color: "black",                              
                                }}
                            />
                            <div className="sectionAcctBody">
                                <h3>First Name: {this.getFirstName()}</h3>
                                <h3>Last Name: {this.getLastName()}</h3>
                                <h3>Email: {this.getEmail()}</h3>
                                <h3>Phone Number: {this.getPhoneNumber()}</h3>                                
                            </div>							
                        </div>

                        <br />

                        {/* Upcoming Appointments Section */}
                        <div className="border p-3">
                            <h3 className="sectionAccTitle">Upcoming Appointments:</h3>
                            <hr 
                                style= {{
                                    height: 5, 
                                    width: "100%", 
                                    color: "black",                              
                                }}
                            />
                            <div className="sectionAcctBody">
                                {/* Need to call another componet to get all upcoming appointment information. */}
                                <h3>Day: </h3>
                                <h3>Month: </h3>
                                <h3>Year: </h3>
                                <h3>Vehicle: </h3>                                
                            </div>
                            <div style={{textAlign:'center', margin: '10px'}}>
                                <Button onClick={() => this.openAddAppointment()} style={{margin: '5px'}}>Schedule Appointment</Button>
                                    <Modal
                                        show={this.state.showAddAppointment}
                                        onHide={() => this.closeAddAppointment()}
                                        centered
                                        backdrop="static"
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Schedule Appointment:</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {/* CALL TO SCHEDULE APPOINTMENT CLASS HERE */}
                                            <Calendar callBackFromCalendar={this.setClickedDate} />
                                        </Modal.Body>                                            
                                    </Modal>
                                <Button onClick={() => this.openEditAppointment()} style={{margin: '5px'}}>Edit Existing Appointment</Button>
                                    <Modal
                                        show={this.state.showEditAppointment}
                                        onHide={() => this.closeEditAppointment()}
                                        centered
                                        backdrop="static"
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Edit Existing Appointment:</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {/* CALL TO EDIT APPOINTMENT CLASS HERE */}
                                        </Modal.Body>                                            
                                    </Modal>
                                <Button onClick={() => this.openDeleteAppointment()} style={{margin: '5px'}}>Delete Appointment</Button>
                                    <Modal
                                        show={this.state.showDeleteAppointment}
                                        onHide={() => this.closeDeleteAppointment()}
                                        centered
                                        backdrop="static"
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Delete Appointment:</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {/* CALL TO DELETE APPOINTMENT CLASS HERE */}
                                        </Modal.Body>                                            
                                    </Modal>
                            </div>
                            
                            <div> {/* this is for testing the calendar */}
                                <p>Returned Date is: {this.state.selectedDate}</p>
                                <Calendar 
                                    callBackFromCalendar={this.setClickedDate} // the state must match the call in child class. Then we call the (parent) function on the passed in data                                    
                                />
                            </div>					
                        </div>                   
                    </div>

                    <div className='col-lg-7 col-xs-5 mx-4'>
                        {/* User's Vehicles Section */}
						<div className="border p-3">
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

                            <Row>
                                <div>
                                    {/* need to send UID? */}
                                    <Vehicles />
                                </div>
                            </Row>
                        </div>
                    </div>
                </Row>
            </>
         );
    }
}
  
export default CustomerHomepage;



// OLD CODE BELOW
//   <Navbar fixed="top" bg="light" expand="lg">
//   <Container className="containerLogo">                  
//       <Navbar.Brand href="#home" className="navBarLogo">
//           <img
//           alt=""
//           src="/CarLogo.png"
//           width="20%"
//           height="20%"
//           />{' '}
//           Capitol Car Cleaners
//       </Navbar.Brand>
//   </Container>

//   <Container>
//       <Navbar.Toggle aria-controls="basic-navbar-nav" />
//       <Navbar.Collapse id="basic-navbar-nav" className="navBarLinkTitles">
//           <Nav >
//               <Nav.Link href="#home">Home</Nav.Link> 
//               <Nav.Link href="#link">My Vehicles</Nav.Link>
//               <Nav.Link href="#link">Appointments</Nav.Link>
//               <Nav.Link href="#link">Purchase History</Nav.Link>
//               <NavDropdown title="Account Settings" id="basic-nav-dropdown">
//                   <NavDropdown.Item href="#action/3.1">Reset password</NavDropdown.Item>
//                   <NavDropdown.Divider />
//                   <NavDropdown.Item href="#action/3.2">Reset email</NavDropdown.Item>         
//               </NavDropdown>
//               <Button size='sm'>Logout</Button>
//           </Nav>
//       </Navbar.Collapse>
//   </Container>
// </Navbar> 


// Build a React Calendar Component from scratch  \\
//
// https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/
// https://flaviocopes.com/momentjs/