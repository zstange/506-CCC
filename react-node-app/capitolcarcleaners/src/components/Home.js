import React from 'react';
import { Container, Col, Row, Image, Navbar, Nav, Card } from "react-bootstrap";

function Home() {

    return(
      <Row>
        <Col lg={10}>
          Main page
        </Col>
        <Col>
          Testimonials
        </Col>
      </Row>
    );
}

export default Home;