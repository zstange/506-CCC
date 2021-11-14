import React from 'react';
import { Button, Row, Card, Modal } from "react-bootstrap";

class CustomerInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    openModal() {
        this.setState({ showModal: true });
    }
    
    closeModal() {
        this.setState({ showModal: false });
    }

    render() {
        return (
            <> 
                <Row>
                    <Card style={{ width: '18rem', marginLeft: '10px', marginTop: '10px' }}>
                        <Card.Img variant="top" src="/CarLogo.png" />
                        <Card.Body>
                            <Card.Title>GET MAKE</Card.Title>
                            <Card.Text>
                            Date of last detailing: 
                            <br />
                            </Card.Text>
                            <div style={{textAlign: 'center'}}>
                                <Button variant="danger" onClick={this.openModal()}>Delete Vehicle</Button>
                                <Modal
                                    show={this.state.showModal}
                                    onHide={this.closeModal()}
                                    centered
                                    backdrop="static"
                                >
                                    <Modal.Header >
                                        <Modal.Title>Delete Vehicle</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p>Are you sure you want to remove this vehicle?</p>
                                        <div style={{textAlign: 'center'}}>
                                            {/* this needs to then call the backend to update if confirm is selected */}
                                            <Button variant="primary" size='sm' style={{margin: '5px'}} onClick={this.closeModal()}>Confirm</Button> 
                                            <Button variant="secondary" size='sm' style={{margin: '5px'}} onClick={this.closeModal()}>Cancel</Button>
                                        </div>
                                    </Modal.Body>                   
                                </Modal>
                            </div>
                        </Card.Body>
                    </Card>
                </Row>
            </>
        )
    }
}

export default CustomerInfo;