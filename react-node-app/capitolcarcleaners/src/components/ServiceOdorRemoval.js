import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceOdorRemoval.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceOdorRemoval() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'5%'}}>
                <Row style={{justifyContent: "center"}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Auto Odor Removal</h1>
                        </div>

                        <div>
                            <h2 className="pricingTitle">Starting at  <strong>$40</strong></h2>
                            <h5 className="disclaimer">*Pricing may varry based on vehicle condition</h5>
                        </div>

                        <p className="cleaningTitles">Service Includes:</p>

                        <Row>
                            <Col>                                                         
                                <Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <div style={{display:'flex', justifyContent:'center', width:'75%', alignItems:'center'}}>
                                        <ListGroup as="ul">
                                            <ListGroup.Item as="li">&#9679; &emsp;Cabin Roof Cleaning</ListGroup.Item>
                                            <ListGroup.Item as="li">&#9679; &emsp;Professional Ozone Generator</ListGroup.Item>
                                            <ListGroup.Item as="li">&#9679; &emsp;Deep Cleaning of Affected Areas</ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                </Row>                                                                                         
                            </Col>
                        </Row>

                        <div style={{marginTop:'36px'}}>
                            <h4 className="textTitle">Odor Free Professional Ozone Generator All Odors Removed Guarantee</h4>
                            <p className="textParagraph">
                                We can eliminate any odor with our specialized approach to odor removal. Get rid 
                                of the funk and let us help you restore that new car smell again.
                            </p>
                        </div>
                    </Col>

                    <Col style={{display:'flex',flexWrap:'wrap', alignItems:'center', justifyContent:'center'}}>  
                        <Image src="odorRemoval.png" style={{width: '85%', marginBottom: '12px', height:'85%'}}/>                                                 
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceOdorRemoval;