import React from "react"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ServiceBoat.css';
import {ListGroup, Row, Col, Image} from "react-bootstrap";

function ServiceCeramicCoat() {
    return (
        <>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', marginTop:'2.5%'}}>
                <Row style={{justifyContent: "center"}}>
                    <Col> 
                        <div className="headerTitle">
                            <h1>Ceramic Coating</h1>
                        </div>

                        <div>
                            <h2 className="pricingTitle">Starting at <strong>$900</strong></h2>
                            <h5 className="disclaimer">*Pricing may varry based on vehicle condition</h5>
                        </div>

                        <p className="cleaningTitles"> What is Ceramic coating?</p>
                        <p className="textParagraph">
                            Ceramic coating is a clear, nano crystalline films that protect the surface beneath from 
                            environmental contaminants and chemical attack much beyond what a conventional wax or 
                            paint sealant could offer. Ceramic coatings are the next generation of paint protection 
                            offerings.
                        </p>
                        <p className="cleaningTitles">Benefits of Ceramic Coating</p>                     

                        <Row>
                            <Col>                                                         
                                <Row style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <div style={{display:'flex', justifyContent:'center', width:'75%', alignItems:'center'}}>
                                        <ListGroup as="ul" style={{}}>
                                            <ListGroup.Item as="li">
                                                1. &emsp;Creates a strong bond between the coating and the paint 
                                                that allows the paint to be more protected and more resistant to 
                                                bugs, tar, brake dust, salt and other road chemicals.</ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                2. &emsp;Creates an incredible shine that lasts and rejuvenates 
                                                itself everytime you wash the vehicle</ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                3. &emsp;Lasts far longer than any paint sealant or wax</ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                4. &emsp;Car stays cleaner longer! Ceramic coatings work at the 
                                                molecular level to keep the surface of the coating smooth so dirt 
                                                has a harder time sticking.</ListGroup.Item>
                                            <ListGroup.Item as="li">
                                                5. &emsp;No waxs or coatings needed after application for the duration
                                                 of the ceramic lifetime provided you take care of the paint and 
                                                 use our specially formulated “ceramic wash system”</ListGroup.Item>
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
                        <Image src="ceramicCoating.png" style={{width: '85%', marginBottom: '12px', height:'70%'}}/>                                                 
                    </Col>
                </Row> 
            </div>            
        </>
    );
}
export default ServiceCeramicCoat;