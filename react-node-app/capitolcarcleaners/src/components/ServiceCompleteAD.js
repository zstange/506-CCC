import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceCompleteAD.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceCompleteAD() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'2.5%'}}>
                <Row style={{justifyContent: "center",}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Complete Auto Detailing</h1>
                        </div>

                        <div>
                            <h2 className="pricingTitle">Starting at  <strong>$180</strong></h2>
                            <h5 className="disclaimer">*Pricing may varry based on vehicle condition</h5>
                            <h4 className="sellerTitle">Capitol Car Cleaners Best Selling Package Includes:</h4>
                        </div>

                        <Row>
                            <Col>
                                <p className="cleaningTitles">Interior Cleaning</p>                         
                                
                                <ListGroup as="ul" style={{display:"block", marginLeft:"24px"}}>
                                    <ListGroup.Item as="li">&#9679; &emsp;Dashboard Cleaning</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Door Panel Cleaning</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Floor Mat Cleaning</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Shampooing</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Stain and Odor Removal</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Leather Cleaning and Conditioning</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Vacuuming</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Window Cleaning</ListGroup.Item>

                                </ListGroup>                                                         
                            </Col>

                            <Col>
                                <p className="cleaningTitles">Exterior Cleaning</p>
                                <ListGroup>
                                    <ListGroup.Item as="li">&#9679; &emsp;Bug Removal</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Dirt, Grime and Tar Removal</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Engine Cleaning</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Hand Washing</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Headlight Covers Polishing</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Paint Polishing and Waxing</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Rim Cleaning</ListGroup.Item>
                                    <ListGroup.Item as="li">&#9679; &emsp;Tire Cleaning</ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </Col>

                    <Col style={{display:'flex',flexWrap:'wrap', alignItems:'center', justifyContent:'center', }}>  
                        <Image src="interiorCleaning2.png" style={{width: '75%', marginBottom: '12px', height:'45%'}}/>                                                 
                        <Image src="car-wash3.png" style={{width: '75%', height:'45%'}}/>
                        
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceCompleteAD;