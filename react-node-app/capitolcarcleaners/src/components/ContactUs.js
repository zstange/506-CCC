import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ContactUs.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ContactUs() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'2.5%'}}>
                <Col style={{textAlign: "center",}}>
                    <Row style={{fontFamily: 'factoria,serif'}}> 
                        <div className="headerTitle">
                            <h1>Contact Us</h1>
                        </div>

                        <div style={{marginBottom: '15px', fontSize: '18px'}}>
                          <h5 style={{fontWeight: 'bold'}}>Hours:</h5>
                          <div>Mon-Fri: 8am-5pm</div>
                          <div>Sat: By Appointment</div>
                        </div>

                        <div>
                            <h5>Capitol Car Cleaners has Two Locations in Madison:</h5>
                        </div>

                        <Row>
                            <Col>
                                <p className="locationTitles">West Towne</p>                         
                                <div class='addressInfo'>
                                  <div>6802 Watts Rd.</div>
                                  <div>Madison, WI 53719</div>
                                  <div><strong>Phone:</strong> 608-271-4419</div>
                                </div>
                                <Image src="WestTowne.jpg" style={{width: '80%', marginTop: '12px', height:'60%'}}/>                                                        
                            </Col>

                            <Col>
                                <p className="locationTitles">East Towne</p>
                                <div class='addressInfo'>
                                  <div>4102 Lien Rd.</div>
                                  <div>Madison, WI 53704</div>
                                  <div><strong>Phone:</strong> 608-630-8327</div>
                                </div>
                                <Image src="EastTowne.jpg" style={{width: '80%', marginTop: '12px', height:'60%'}}/> 
                            </Col>
                        </Row>
                    </Row>
                </Col> 
            </div>            
        </>
    );
}
export default ContactUs;