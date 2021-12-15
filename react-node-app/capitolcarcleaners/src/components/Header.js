import React, { useState } from 'react';
import { Container, Col, Row, Image, Navbar, Nav, NavDropdown} from "react-bootstrap";
import {LinkContainer as Link, LinkContainer} from 'react-router-bootstrap';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { logUserOut } from "../statusSlice";
import { removeRole } from "../roleSlice";
import { Button } from 'react-bootstrap';
import { removeUserId } from '../userIdSlice';
import "../css/Header.css";
import { removeToken } from '../tokenSlice';

function Header() {
  const loggedIn = useSelector((state) => state.loggedIn.value);
  const dispatch = useDispatch();

  const loginLogoutButton = () => {
    if (loggedIn) {
      return (
        <>
        <Nav.Item className="ms-auto">
          <Link to="/CustomerHomepage">
            <Nav.Link>My Account</Nav.Link>
          </Link>
        </Nav.Item>
        <Nav.Item className="ms-auto">
          <Link to='/'>
          <Button variant='danger' onClick={() => logoutUser()}>Logout</Button>
          </Link>
        </Nav.Item>
        </>
      );
    } else {
      return (
        <Nav.Item className="ms-auto">
          <Link to="/Login">
            <Nav.Link>Login/Sign Up</Nav.Link>
          </Link>
        </Nav.Item>
      );
    }
  }

  const logoutUser = () => {
    dispatch(logUserOut());
    dispatch(removeRole());
    dispatch(removeUserId());
    dispatch(removeToken());
  }

  return(
    <>
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
              <div class="title">Capitol Car & Motorcyle Cleaners</div>
              <div class="subtitle">Auto Detailing at its best!</div>
            </Row>
          </Col>
        </Row>
        <Row>
          <Navbar className="header" fixed='bottom' expand="lg" style={{position: 'relative', fontSize: '14px', bottom: '16px', left: '-25px'}}>
            <Container fluid>
              <Link to="/">
                  <Navbar.Brand>Home</Navbar.Brand>
              </Link>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="container-fluid">
                  <Link to="/ServiceCompleteAD">
                      <Nav.Link>Complete Auto Detailing</Nav.Link>
                  </Link>
                  <Link to="/ServiceInteriorAD">
                      <Nav.Link>Interior Cleaning</Nav.Link>
                  </Link>
                  <Link to="/ServiceExteriorAD">
                      <Nav.Link>Exterior Cleaning</Nav.Link>
                  </Link>
                  <NavDropdown title="Other Services" id="basic-nav-dropdown">
                    <Link to="/ServiceOdorRemoval">
                        <NavDropdown.Item>Odor Removal</NavDropdown.Item>
                    </Link>
                    <Link to="/ServiceRustProof">
                      <NavDropdown.Item>Rust Proofing</NavDropdown.Item>
                    </Link>  
                    <Link to="/ServiceCeramicCoat">
                      <NavDropdown.Item>Ceramic Coating</NavDropdown.Item>
                    </Link>
                    <Link to="/ServiceMotorcycle">
                    <NavDropdown.Item>Motorcycle Detailing</NavDropdown.Item>
                    </Link>
                    <Link to="/ServiceBoat">
                    <NavDropdown.Item>Boat Detailing</NavDropdown.Item>
                    </Link>
                    <Link to="/ServiceBlinds">
                    <NavDropdown.Item>Window Blind Cleaning</NavDropdown.Item>
                    </Link>
                  </NavDropdown>
                  <Link to="/VehiclesForSale">
                      <Nav.Link>Cars for Sale!</Nav.Link>
                  </Link>
                  <Link to="/ContactUs">
                      <Nav.Link>Contact Us</Nav.Link>
                  </Link>
                  <Link to="/Promotions">
                      <Nav.Link>Promotions</Nav.Link>
                  </Link>
                  <Link to="/">
                      <Nav.Link disabled>Gallery</Nav.Link>
                  </Link>
                  {loginLogoutButton()}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Row>
      </Col>
    </Row>
    </>
  );
}

export default Header;