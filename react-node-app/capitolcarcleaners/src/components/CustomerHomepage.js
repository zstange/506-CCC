import React, {useState} from "react";
import "./App.js";
import "./CustomerHomepage.css"
import { Form, Card, Button, Row, Col, Navbar, Container, Nav, NavDropdown, Carousel} from "react-bootstrap";

function ControlledCarousel() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };   

    return (
        <>
            <Carousel activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="/CarLogo.png" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </Carousel.Item>
                <Carousel.Item>
                    <Card style={{ width: '18rem' }}>
                        <Card.Img variant="top" src="/CarLogo.png" />
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Text>
                            Some quick example text to build on the card title and make up the bulk of
                            the card's content.
                            </Card.Text>
                            <Button variant="primary">Go somewhere</Button>
                        </Card.Body>
                    </Card>
                </Carousel.Item>
            </Carousel>
        </>
    );
}

class CustomerHomepage extends React.Component {

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

    render() {
        return (
            <>
                <Navbar fixed="top" bg="light" expand="lg">
                    <Container className="containerLogo">                  
                        <Navbar.Brand href="#home" className="navBarLogo">
                            <img
                            alt=""
                            src="/CarLogo.png"
                            width="20%"
                            height="20%"
                            />{' '}
                            Capitol Car Cleaners
                        </Navbar.Brand>
                    </Container>

                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="navBarLinkTitles">
                            <Nav >
                                <Nav.Link href="#home">Home</Nav.Link> 
                                <Nav.Link href="#link">My Vehicles</Nav.Link>
                                <Nav.Link href="#link">Appointments</Nav.Link>
                                <Nav.Link href="#link">Purchase History</Nav.Link>
                                <NavDropdown title="Account Settings" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.1">Reset password</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.2">Reset email</NavDropdown.Item>         
                                </NavDropdown>
                                <Button size='sm'>Logout</Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar> 

                <div>
                    <Row>
                        <h1>Welcome, {this.getFirstName()}</h1>                                         
                    </Row>
                </div> 

                <Row>
                    <div className="col-lg-4 col-xs-5 mx-4">
                        <div className="border p-3">
                            <h3 className="sectionAccTitle">Account Information:</h3>
                            <hr 
                                style= {{
                                    height: 5, 
                                    width: "90%", 
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
                    </div>

                    <div className='col-lg-6 col-xs-5 mx-4'>
						<div className="border p-3">
							<Row>
								<div>
									<h2>Your Vehicles:</h2>
                                    <hr 
                                        style= {{
                                            height: 5, 
                                            width: "90%", 
                                            color: "black",                                
                                        }}
                                    />
                                </div>
                            </Row>

                            <Row>
                                <div>
                                    <ControlledCarousel />
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