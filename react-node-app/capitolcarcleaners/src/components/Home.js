import React from 'react';
import { Container, Col, Row, Card, Image, Carousel } from "react-bootstrap";
import "../css/Home.css";

const testimonial = [
  {name: 'Angie F.', testimonial: '"Took my car to get cleaned and detailed last month to be ready for winter. They did a great job - even got out a stain that had been in the car since I purchased it 6 years ago! Friendly and professional service."'},
  {name: 'Brian M.', testimonial: '"Thank You Steve!  Car looks fantastic never thought you would be able to make my car look so new again great job. I would recommend your company to anyone. Thanks again."'},
  {name: 'Margie B.', testimonial: '"I am a fussy Grandma and never had professional detail work done to a car before. I will never have to look anywhere else to have my car detailed. The job was beyond "detailed" with extra care taken that I did not even expect! Their store is also immaculate and very organized. I cannot put into words what a good job they do. Thank you Tony such a wonderful job."'},
  {name: 'Suzana R.', testimonial: '"Took my car to get cleaned and detailed after winter. They did a fantastic job - it looks like a new car! Professional service and friendly staff. Highly recommended."'},
  {name: 'Dayla S.', testimonial: '"Wow! just had our car interior cleaned today. amazing. we have been driving our car for over five years and have had typical spills along with years of debris adding up. I thought the cleaning would make a dent, but our car truly looks new. super happy with their service and price. strongly recommend!" '},
  {name: 'Rick B.', testimonial: '"Brought my car in for a full interior detailing. Some of my kid\'s friends were smoking cigarettes in it and the smell was in the carpet. Picked up the car 3 hours later and it was spotless. Got in and I smelled nothing, which is a good thing. Great job and friendly service."'},
  {name: 'Pete H.', testimonial: '"My car was transported from Alaska to Wisconsin. After a month on a ship, in a freight yard and on a truck in winter weather, it was filthy - inside and out.  These guys made the car look and smell like new, and they charge a lot less than the car dealerships."'},
  {name: 'Karl H.', testimonial: '"If you are looking for a detailing shop that does a great job for a very reasonable price, Capitol Car Cleaners is the best. I definitely will be a repeat customer."'},
]

class Home extends React.Component {

  render() {
    return(
      <>
      <Row className='body'>
        <Col lg={8} style={{padding: '30px'}}>
          <Row>
            <Col>
              <Row>
                <div class="d-flex justify-content-center">
                  <h1>35 Years in Business</h1>
                </div>
              </Row>
              <Row className="d-flex justify-content-center">
                <Carousel style={{margin: '30px', width: '60%', height: '80%'}}>
                  {this.getCarouselImages()}
                </Carousel>
              </Row>
              <Row>
                <div>
                  <h4 class="d-flex text-title justify-content-center">What is auto detailing?</h4>
                  <p >
                    Detailing is a labor and time-intensive deep cleaning of the interior and exterior of a vehicle. 
                    The goal is to clean up your vehicle inside and out - wash it, wax it, remove any stains, odors, 
                    and bring it to as close to new as possible. When this is performed on a regular basis, a vehicle will look and feel brand new.
                  </p>
                </div>
              </Row>
              <br/>
              <Row>
                <h4 class="text-title">Auto Detailing at Its Best</h4>
                <p class="subtext">
                  <div>Take your car from dull to dazzling</div>
                  <div>If your car needs a thorough, effective cleaning, bring it to the expert auto detailers of Capitol Car & Motorcycle Cleaners.</div>
                </p>
                <Col className="info-column">
                  <Image src={"locallyOwned.png"} style={{marginBottom: '15px'}}/>
                  <h5 class='info-col-title'>Locally-owned and operated</h5>
                  <div class='info-col-text'>
                    Prolong your vehicle's optimal value or return it back to that new car smell you love. 
                    We cut no corners in giving your vehicle's interior and exterior the deep cleaning it needs.
                  </div>
                </Col>
                <Col className="info-column">
                  <Image src={"30Years.png"} style={{marginBottom: '15px'}}/>
                  <h5 class='info-col-title'>35 Years in Business</h5>
                  <div class='info-col-text'>
                    No matter what kind of car, truck, van, or SUV you drive, we have the experience, products, 
                    tools, and dedication to make it look incredible. We also offer blind cleaning service.
                  </div>
                </Col>
                <Col className="info-column">
                  <Image src={"topAutomotive.png"} style={{marginBottom: '15px'}}/>
                  <h5 class='info-col-title'>Madison's top Automotive cleaner</h5>
                  <div class='info-col-text'>
                    Are you in need of affordable auto detailing that'll leave your vehicle smelling fresh and looking sharp? 
                    Remove all traces of Wisconsin's harsh winter weather from your car or truck.
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col className="d-flex flex-column testimonial-panel">
          <Row style={{marginTop: '30px', color: 'black'}}>
            <div class="d-flex title justify-content-center">
              <h3>Testimonials</h3>
            </div>
          </Row>
          <Row className="flex-grow-1" >
            <Container style={{maxHeight:'155vh', overflowY: 'scroll'}}>
              {this.getTestimonials()}
            </Container>
          </Row>
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

    for (let i = 0; i < testimonial.length; i++) { //needs to be replaced with information from the database
      testimonials.push (
        <Row className="justify-content-center">
          <Card body style={{width: '90%', margin: '10px', fontSize: '10px', backgroundColor: 'lightblue'}}>
            <blockquote className="blockquote mb-0">
              <p>
                {' '}{testimonial[i].testimonial}{' '}
              </p>
              <footer className="blockquote-footer" style={{color: 'steelblue', fontSize: '14px'}}>
                {testimonial[i].name}
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