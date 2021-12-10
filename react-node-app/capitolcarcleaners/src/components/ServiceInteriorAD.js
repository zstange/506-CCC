import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceInteriorAD.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceInteriorAD() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'2.5%'}}>
                <Row style={{justifyContent: "center",}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Interior Auto Detailing</h1>
                        </div>

                        <div>
                            <h2 className="pricingTitle">Starting at  <strong>$140</strong></h2>
                            <h5 className="disclaimer">*Pricing may varry based on vehicle condition</h5>
                        </div>

                        <p className="cleaningTitles">Service Includes:</p>

                        <Row>
                            <Col>
                                                         
                                <Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <div style={{display:'flex', justifyContent:'center', width:'75%', alignItems:'center'}}>
                                    <ListGroup as="ul" style={{width:'50%'}}>
                                        <ListGroup.Item as="li">&#9679; &emsp;Dashboard Cleaning</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Door Panel Cleaning</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Floor Mat Cleaning</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Shampooing</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Stain and Odor Removal</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Leather Cleaning and Conditioning</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Vacuuming</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Window Cleaning</ListGroup.Item>
                                    </ListGroup>
                                    </div>
                                </Row>                                                                                         
                            </Col>
                        </Row>

                        <div style={{marginTop:'36px'}}>
                            <h4 className="textTitle">Get your auto cabin looking fresh</h4>
                            <p className="textParagraph">
                                Every time you and your passengers step into your vehicle, you drag dirt
                                and grime into your car or truck. Over time this dirt can leave your
                                vehicle looking old and beat. Rely on Capitol Car Cleaners to reverse 
                                the effects that day-to-day use can have on your vehicle's interior.
                            </p>
                        </div>
                    </Col>

                    <Col style={{display:'flex',flexWrap:'wrap', alignItems:'center', justifyContent:'center', }}>  
                        <Image src="interiorCleaning3.png" style={{width: '75%', marginBottom: '12px', height:'45%'}}/>                                                 
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceInteriorAD;