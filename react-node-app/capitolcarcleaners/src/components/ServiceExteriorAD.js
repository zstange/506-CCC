import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceExteriorAD.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceExteriorAD() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'2.5%'}}>
                <Row style={{justifyContent: "center",}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Exterior Auto Detailing</h1>
                        </div>

                        <div>
                            <h2 className="pricingTitle">Starting at <strong>$105</strong></h2>
                            <h5 className="disclaimer">*Pricing may varry based on vehicle condition</h5>
                        </div>  

                        <p className="cleaningTitles">Service Includes:</p>

                        <Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <div style={{display:'flex', justifyContent:'center', width:'75%', alignItems:'center'}}>
                                <ListGroup as="ul" style={{width:'50%'}}>
                                    <ListGroup.Item as="li">&#9679; &emsp;Bug Removal</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Dirt, Grime and Tar Removal</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Engine Cleaning</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Hand Washing</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Headlight Covers Polishing</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Paint Polishing and Waxing</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Rim Cleaning</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Tire Cleaning</ListGroup.Item>
                                </ListGroup>
                            </div>
                        </Row>

                        <div style={{marginTop:'24px'}}>
                            <h4 className="textTitle">Get your car that showroom shine</h4>
                            <p className="textParagraph">
                                Count on the detailing experts of Capitol Car & Motorcycle Cleaners to make your car
                                 or truck the envy of the streets. Our exterior cleaning services will leave your 
                                 vehicle looking like it was just driven off the showroom floor. We offer everything
                                  you need from hand washing, to headlight oxidation, and rim detailing.
                            </p>
                            
                        </div>
                       
                    </Col>                    

                    <Col style={{display:'flex',flexWrap:'wrap', alignItems:'center', justifyContent:'center', }}>  
                        <Image src="ExteriorCleaning1.png" style={{width: '75%', height:'50%'}}/>                                            
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceExteriorAD;