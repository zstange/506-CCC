import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceBoat.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceBoat() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'5%'}}>
                <Row style={{justifyContent: "center"}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Boat Detailing</h1>
                        </div>

                        <div>
                            <h2 className="pricingTitle">Starting at <strong>$120</strong></h2>
                            <h5 className="disclaimer">*Pricing may varry based on boat model and/or size</h5>
                        </div>

                        <p className="cleaningTitles">Service Includes:</p>

                        <Row>
                            <Col>                                                         
                                <Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <div style={{display:'flex', justifyContent:'center', width:'75%', alignItems:'center'}}>
                                        <ListGroup as="ul">
                                            <ListGroup.Item as="li">&#9679; &emsp;Pressure wash exterior of boat and trailer</ListGroup.Item>
                                            <ListGroup.Item as="li">&#9679; &emsp;Complete interior detail</ListGroup.Item>
                                            <ListGroup.Item as="li">&#9679; &emsp;Scrub and clean seats</ListGroup.Item>
                                            <ListGroup.Item as="li">&#9679; &emsp;Wash windows</ListGroup.Item>
                                            <ListGroup.Item as="li">&#9679; &emsp;Vacuuming</ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                </Row>                                                                                         
                            </Col>
                        </Row>

                        <div style={{marginTop:'36px'}}>                           
                            <p className="textParagraph">
                            Boats are a big investment! Keeping your boat clean will only enhance the resale 
                            value of your boat. Let our experienced team help protect your investment and keep it looking in top shape!
                            </p>
                        </div>
                    </Col>

                    <Col style={{display:'flex',flexWrap:'wrap', alignItems:'center', justifyContent:'center'}}>  
                        <Image src="boatDetailing.png" style={{width: '85%', marginBottom: '12px', height:'85%'}}/>                                                 
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceBoat;