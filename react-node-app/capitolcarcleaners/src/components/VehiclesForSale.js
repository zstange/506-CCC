import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/VehiclesForSale.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";

function MakeCars(props) {
    const [validated, setValidated] = useState(false)
    const [contents, setContents] = useState({iid: -1, price: -1, make: "", model: "", year: -1, color: "", additionalInfo: "", image: ""});
    const [vehicles, setVehicles] = useState([])
    const [modifyModal, showModifyModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [modifyTitle, setModifyTitle] = useState("")
    const [showAdminInfo, setAdminInfo] = useState(false)
    const [allowSubmit,disableSubmit] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => { 
        // useEffect lets us fetch tables once the page is finished loading
        async function fetchTables() {
            // pull vehicles table from the database
            let vehicles = [] // temporary array so we can set the table state later    

            // set vehicles here
            
            if (props.role === "admin")
                setAdminInfo(true)
            setReady(true)
        }
        fetchTables()
    }, [props.role]);
    
    const handleChange = (event) => {
        setContents({...contents, [event.target.id]: event.target.value})
    }

    // handle card buttons
    const handleCardClick = (event) => {
        disableSubmit(false)
        let mode = event.target.id.substring(0, 6) // get mode from button id
        let temp = contents
        temp.iid = event.target.id.substring(7, event.target.id.length) // get iid from the last portion of button id
        setContents(temp)

        if (mode === "delete") 
            showDeleteModal(true)
        else {
            showModifyModal(true)
            setModifyTitle(mode.chartAt(0).toUpperCase+mode.substring(1,6)+" Vehicle Listing")
        }
    }

    // handle delete modal buttons
    const handleDeleteModal = (event) => {
        disableSubmit(true)
        let iid = contents.iid // get aid from contents array
        if (event.target.id === "delete_cancel")
            showDeleteModal(false) // cancel lets us just close the modal
        else { // delete car
            // delete car
            showDeleteModal(false)
        }
    }

    // handle modify modal buttons
    const handleModifyModal = async(event) => {
        let iid = contents.iid // get aid from contents array
        let mode = event.target.id

        if (mode === "modify_cancel") { // if we are canceling, just close the window
            event.preventDefault();
            showModifyModal(false)
            setValidated(false)
        }
        else { // if we are confirming, we have to validate the form
            const form = event.currentTarget;
            event.preventDefault();
            setValidated(true);
            disableSubmit(true)

            // check if form is valid
            if (form.checkValidity() === true) {
                if (mode === "create") {
                    // handle create
                }
                else {
                    // handle modify
                }
                showModifyModal(false)
                setValidated(false);
            }  
            else
                disableSubmit(false)
        }
    }

    if (!ready) {
        return (
            null
        )
    }

    return (
        <>    
        <div>
        <Modal show={modifyModal} centered id = "modifyModal">
        <Modal.Header >
        <Modal.Title>{modifyTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleModifyModal}>
                <Form.Group as={Row} className="mb-3" controlId="price">
                    <Form.Label column sm="3" className="createAccountLabels">Price</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.price}
                            type = "text"
                            placeholder="Price"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="make">
                    <Form.Label column sm="3" className="createAccountLabels">Make</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.make}
                            type = "text"
                            placeholder="Make"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="model">
                    <Form.Label column sm="3" className="createAccountLabels">Model</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.model}
                            type = "text"
                            placeholder="Model"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="year">
                    <Form.Label column sm="3" className="createAccountLabels">Year</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.year}
                            type = "text"
                            placeholder="Year"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="color">
                    <Form.Label column sm="3" className="createAccountLabels">Color</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.year}
                            type = "text"
                            placeholder="Color"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="additionalInfo">
                    <Form.Label column sm="3" className="createAccountLabels">Additional Info</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            value = {contents.additionalInfo}
                            type = "text"
                            placeholder="Additional Info"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="image">
                    <Form.Label column sm="3" className="createAccountLabels">Image Link</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.additionalInfo}
                            type = "text"
                            placeholder="Image Link"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <div style={{textAlign: 'center'}}>
                    <Button type = "submit" disabled = {allowSubmit} variant="primary" size='sm' style={{margin: '5px'}}>Confirm</Button>
                    <Button id="modify_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleModifyModal}>Cancel</Button>  
                </div>                                       
            </Form>    
        </Modal.Body>                   
        </Modal>

        <Modal show={deleteModal} centered id = "deleteModal">
        <Modal.Header >
        <Modal.Title>Delete Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are you sure you want to delete this vehicle?</p>
                <div style={{textAlign: 'center'}}>
                    <Button id="delete_confir" disabled = {allowSubmit} variant="primary" size='sm' style={{margin: '5px'}} onClick={handleDeleteModal}>Confirm</Button>
                    <Button id="delete_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleDeleteModal}>Cancel</Button>
                </div>
        </Modal.Body>                   
        </Modal>
        <div >
            <GenerateAppsList vehicles = {vehicles} />
        </div>
        <br></br>
        <Button className="btn" id = "create" style={{ display: (showAdminInfo ? 'block': 'none'), margin:"auto"}} onClick={handleCardClick}>Create Vehicle Listing</Button>
        </div>
        </>
    );

    function GenerateAppsList(props) {
        let vehicles = props.vehicles
        const GenerateList = ((vehicle, index) =>
            <>
            <Card id = {"card_"+vehicle.iid} style = {{width: window.innerWidth/4, margin:"15px"}} className = "box">
            <Card.Header> moneeeyy</Card.Header>
            <Card.Body>
                <Card.Title>title</Card.Title>
                <ListGroup className="list-group-flush">
                    <ListGroupItem>a</ListGroupItem>
                    <ListGroupItem>b</ListGroupItem>
                    <ListGroupItem>c</ListGroupItem>
                    <ListGroupItem>d</ListGroupItem>
                </ListGroup> 
            </Card.Body>
            <div style = {{display: (showAdminInfo ? 'block': 'none'), textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>
                <Button id = {"modify-"+vehicle.iid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify</Button>   
                <Button id = {"delete-"+vehicle.iid} style = {{marginLeft: '5px'}} variant="danger" onClick={handleCardClick}>Delete</Button>
            </div>
            <div style = {{display: (showAdminInfo ? 'block': 'none'), textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>
                <Button id = {"status-"+vehicle.iid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify Status</Button>   
            </div>
            </Card>
            </>
        );
        return <div className = "grid" >{vehicles.map(GenerateList)}</div>
    }
}

function MakeAdminPage() {

    const [vehiclesTable, setVehiclesTable] = useState([])
    const [ready,setReady] = useState(false)

    useEffect(() => {
        // useEffect lets us fetch tables once the page is finished loading
        async function fetchTables() {
            // get vehicles for sale
        }
        fetchTables()
        setReady(true)
    }, []);

    // render vehicle's list
    if (ready) {
        return (
            <>
            <br></br>
                <label className="AllAppHeader">Vehicles For Sale</label>
            <div>
                <MakeCars role = {"admin"} setVehicles = {setVehiclesTable} vehicles = {vehiclesTable}/>
            </div>
            </>
        );
    }
    else {
        return (
          <label>loading...</label>  
        );
    }
}

class VehiclesForSale extends React.Component { 

    render() {
        if (this.props.role === "admin") { // role check
            return (
                <>
                <Row style={{padding: '1%'}}>
                    <div className = "List">     
                       <MakeAdminPage/>
                    </div>     
                </Row> 
                </>
            );
        }
        else {
            return (
                <>
                <Row style={{padding: '1%'}}>
                    <div className="Grid">     
                        <MakeCars role = {"user"}/>
                    </div>     
                </Row> 
                </>
            );
        }
    }      
}

export default VehiclesForSale;