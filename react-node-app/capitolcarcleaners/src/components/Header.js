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
                    <Link to="/CreateAccount">
                        <Nav.Link>Create Account</Nav.Link>
                    </Link>
                    <Link to="/ForgotPassword">
                        <Nav.Link>Forgot Password</Nav.Link>
                    </Link>
                    <Link to="/CustomerHomepage">
                        <Nav.Link>Customer Homepage</Nav.Link>
                    </Link>
                    <NavDropdown title="Other Services" id="basic-nav-dropdown">
                      <NavDropdown.Item >Service 1</NavDropdown.Item>
                      <NavDropdown.Item >Service 2</NavDropdown.Item>
                      <NavDropdown.Item >Service 3</NavDropdown.Item>
                    </NavDropdown>
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