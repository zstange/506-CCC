import React from 'react';
import { Container, Col, Row, Image, Navbar, Nav, NavDropdown} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'

function Header() {
    return(
      <Row className="header">
        <Col lg={2}>
          <Row className="justify-content-center">
            <Image src="CarLogo.png" style={{width: '80%'}}/>
          </Row>
        </Col>
        <Col>
          <Row style={{height: '75%'}}>
            <Col>
              <Row>
                <div>Capitol Car & Motorcyle Cleaners</div>
                <div>Auto Detailing at its best!</div>
              </Row>
            </Col>
          </Row>
          <Row>
            <Navbar fixed='bottom' bg='light' expand="lg" style={{position: 'relative'}}>
              <Container fluid>
                <Link to="/">
                    <Navbar.Brand>Home</Navbar.Brand>
                </Link>
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="container-fluid">
                    <Link to="/">
                        <Nav.Link disabled>Complete Auto Detailing</Nav.Link>
                    </Link>
                    <Link to="/">
                        <Nav.Link disabled>Interior Cleaning</Nav.Link>
                    </Link>
                    <Link to="/">
                        <Nav.Link disabled>Exterior Cleaning</Nav.Link>
                    </Link>
                    <Link to="/">
                        <Nav.Link disabled>Odor Removal</Nav.Link>
                    </Link>
                    <NavDropdown title="Other Services" id="basic-nav-dropdown">
                      <NavDropdown.Item>Rust Proofing</NavDropdown.Item>
                      <NavDropdown.Item>Ceramic Coating</NavDropdown.Item>
                      <NavDropdown.Item>Motorcycle Detailing</NavDropdown.Item>
                      <NavDropdown.Item>Boat Detailing</NavDropdown.Item>
                      <NavDropdown.Item>Window Blind Cleaning</NavDropdown.Item>
                    </NavDropdown>
                    <Link to="/">
                        <Nav.Link disabled>Cars for Sale!</Nav.Link>
                    </Link>
                    <Link to="/">
                        <Nav.Link disabled>Contact Us</Nav.Link>
                    </Link>
                    <Link to="/">
                        <Nav.Link disabled>Gallery</Nav.Link>
                    </Link>
                    <Nav.Item className="ms-auto">
                    <Link to="/Login">
                      <Nav.Link>Login/Sign Up</Nav.Link>
                    </Link>
                    </Nav.Item>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
          </Row>
        </Col>
      </Row>
    );
}

export default Header;