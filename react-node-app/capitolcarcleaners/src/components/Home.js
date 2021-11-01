import React from 'react';
import { Container, Col, Row, Card, Image, Carousel } from "react-bootstrap";

class Home extends React.Component {

  render() {
    return(
      <>
      <Row>
        <Col lg={9}>
          <Row className="justify-content-center">
          <Carousel style={{margin: '100px', width: '50%'}}>
            {this.getCarouselImages()}
          </Carousel>
          </Row>
        </Col>
        <Col>
          <Row className="justify-content-center" style={{marginTop: '30px'}}>
            Testimonials
          </Row>
          {this.getTestimonials()}
        </Col>
      </Row>
      </>
  );
}

  getCarouselImages() {
    let images = [];

    for (let i = 1; i <= 5; i++){
      images.push(
        <Carousel.Item interval={3000}>
          <Image
            style={{width: 'inherit'}}
            src={"carouselHome/carousel" + i + ".jpg"}
            rounded
          />
        </Carousel.Item>
      );
    }

    return images;
  }

  getTestimonials() {
    let testimonials = [];

    for (let i = 0; i < 9; i++) { //needs to be replaced with information from the database
      testimonials.push (
        <Row className="justify-content-center">
          <Card body style={{width: '80%', margin: '10px'}}>
            <blockquote className="blockquote mb-0">
              <p>
                {' '}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere
                erat a ante.{' '}
              </p>
              <footer className="blockquote-footer">
                Customer
              </footer>
            </blockquote>
          </Card>
        </Row>
      );
    }

    return testimonials;
  }
}

export default Home;