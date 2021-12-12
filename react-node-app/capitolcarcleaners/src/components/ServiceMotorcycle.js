import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceMotorcycle.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceMotorcycle() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'5%'}}>
                <Row style={{justifyContent: "center"}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Motorcycle Detailing</h1>
                        </div>

                        <p className="textParagraph"> 
                            Our motorcycle cleaning and detailing services offer professional 
                            results for your for sportbikes, cruisers, trikes, touring bikes, 
                            and all other two-wheeled vehicles. We have the specialized tools 
                            to reach every crack and crevice.
                        </p>

                        {/* <div>
                            <h2 className="pricingTitle">Starting at <strong>$</strong></h2>
                            <h5 className="disclaimer">*Pricing may varry based on vehicle condition</h5>
                        </div> */}

                        <h2 className="headerTitle" style={{marginBottom: '12px', marginTop: '24px'}}><strong>Package Offerings</strong></h2>

                        <Row>
                            <Col>
                                <h3 className="headerTitle">The Quickie <strong>$75</strong></h3>                         
                                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <ListGroup as="ul" style={{display:"block", width: '75%', marginLeft:"24px"}}>
                                        <ListGroup.Item as="li">&#9679; &emsp;Shampooing</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Waxing</ListGroup.Item>
                                    </ListGroup>
                                </div>                                                         
                            </Col>

                            <Col>
                                <h3 className="headerTitle">The Full Monte <strong>$135</strong></h3>
                                <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <ListGroup as="ul" >
                                        <ListGroup.Item as="li">&#9679; &emsp;Bug Removal</ListGroup.Item>                                    
                                        <ListGroup.Item as="li">&#9679; &emsp;Chrome Polishing</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Degreasing</ListGroup.Item>                                    
                                        <ListGroup.Item as="li">&#9679; &emsp;Fairing and Saddle Bag Cleaning</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Leather Cleaning and Conditioning</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Shampooing</ListGroup.Item>
                                        <ListGroup.Item as="li">&#9679; &emsp;Waxing</ListGroup.Item>
                                    </ListGroup>
                                </div>
                            </Col>
                        </Row>

                        <div style={{marginTop:'36px'}}>
                            <h4 className="textTitle"></h4>
                            <p className="textParagraph">
                                
                            </p>
                        </div>
                    </Col>

                    <Col style={{display:'flex',flexWrap:'wrap', alignItems:'center', justifyContent:'center'}}>  
                        <Image src="motorcycleDetail.png" style={{width: '75%', marginBottom: '12px', height:'60%'}}/>                                                 
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceMotorcycle;