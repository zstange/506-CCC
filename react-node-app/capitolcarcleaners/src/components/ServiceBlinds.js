import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceBlinds.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceBlinds() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'5%'}}>
                <Row style={{justifyContent: "center"}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Window Blind Cleaning</h1>
                            <p className="disclaimer">*Drop Off Service Only</p>
                        </div>   

                        <div style={{marginTop:'36px'}}>
                            <h4 className="textTitle">We can clean more than just cars</h4>
                            <p className="textParagraph">
                                Cleaning your blinds can be a very tedious spring cleaning task. Let us take the job 
                                off of your hands. Keep your home and office bright and cheery with clean blinds. 
                                We offer ultrasonic cleaning. This the manufacturer recommended method of 
                                cleaning blinds. Drop off service only.
                            </p>
                        </div>                 

                        <h2 className="headerTitle" style={{marginTop:'24px'}}><strong>Pricing:</strong></h2>

                        <Row>
                            <Col>                                                         
                                <Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <div style={{display:'flex', justifyContent:'center', width:'75%', alignItems:'center'}}>
                                        <ListGroup as="ul">
                                            <ListGroup.Item as="li">&#9679; &emsp; Mini blinds <strong>$9.50 - $11.50</strong> each</ListGroup.Item>
                                            <ListGroup.Item as="li">&#9679; &emsp;Vertical blinds <strong>$1.50</strong> per slate</ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                </Row>                                                                                         
                            </Col>
                        </Row>

                        <div style={{marginTop:'48px'}}>
                            <h4 className="textTitle">We can often provide next day turn-around.</h4>
                            <p className="textParagraph">
                                We utilize an ultrasonic cleaning method, which is the manufacturers 
                                recommended way to clean your blinds. Your blinds will be ready by 
                                noon the next morning. No matter what kind of blinds you have in your 
                                home or office space, we can get them as clean as possible. We 
                                clean all aluminum and plastic, and most any kid of blinds. 
                            </p>
                        </div>
                    </Col>

                    <Col style={{display:'flex',flexWrap:'wrap', alignItems:'center', justifyContent:'center'}}>  
                        <Image src="blinds.png" style={{width: '85%', marginBottom: '12px', height:'70%'}}/>                                                 
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceBlinds;