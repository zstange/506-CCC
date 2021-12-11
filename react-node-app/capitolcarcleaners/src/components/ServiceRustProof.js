import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceRustProof.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceRustProof() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'2.5%'}}>
                <Row style={{justifyContent: "center"}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Auto Rust Proofing</h1>
                        </div>

                        <div>
                            <h2 className="pricingTitle">Starting at <strong>$525</strong></h2>
                            <h5 className="disclaimer">*Pricing may varry based on vehicle condition</h5>
                        </div>

                        <p className="cleaningTitles">Capitol Car Cleaners proudly features corrosion protection by Z-Tech!</p>

                        <p className="textParagraph">
                            Protect your vehicle with warrantied protection against rust through from road salt, 
                            acid rain, and corrosive materials. Wisconsin is one of the worst rated states in the U.S.
                            for road salt exposure. Paint is your Only Protection Between Your Vehicle's Undercarriage
                            and Road Salt! Extremely heavy road salt usage in the Upper Midwest 
                            (rougly 4 tons per lane mile annually) speeds up damage caused by rust.  
                            Without undercoating your vehicle the only option is to replace the parts.
                        </p>

                        <p className="cleaningTitles">Undercoating</p>
                        <p className="textParagraph">
                            Corrosion Protection undercoat applied to your vehicle’s underbody protects against 
                            abrasion and corrosion. Also helps to deaden road noise.
                        </p>

                        <p className="cleaningTitles">Innercoating</p>
                        <p className="textParagraph">
                            Corrosion Protection innercoat is applied to inner panels through existing access 
                            holes. No Additional Holes are ever drilled into your vehicle’s body panels!
                        </p>

                        <p className="cleaningTitles">Fully Insured Written Warranty</p>
                        <Row>
                            <Col>                                                         
                                <Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <div style={{display:'flex', justifyContent:'center', width:'75%', alignItems:'center'}}>
                                        <ListGroup as="ul" style={{}}>
                                            <ListGroup.Item as="li">&#9679; &emsp;New Vehicles - <strong>10 Year</strong> Rust Perforation Warranty</ListGroup.Item>
                                            <ListGroup.Item as="li">&#9679; &emsp;Pre-Driven Vehicles - <strong>6 Year</strong> Rust Perforation Warranty</ListGroup.Item>
                                        </ListGroup>
                                    </div>
                                </Row>                                                                                         
                            </Col>
                        </Row>

                        <div style={{marginTop:'36px'}}>
                            <h4 className="textTitle"></h4>
                            <p className="textParagraph">
                                
                            </p>
                        </div>
                    </Col>

                    <Col style={{display:'flex',flexWrap:'wrap', alignItems:'center', justifyContent:'center'}}>  
                        <Image src="rustProofing1.png" style={{width: '75%', marginBottom: '12px', height:'50%'}}/>                                                 
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceRustProof;