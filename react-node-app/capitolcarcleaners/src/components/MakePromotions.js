import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/VehiclesForSale.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal, Image, Carousel} from "react-bootstrap";
import { useSelector } from "react-redux";

function MakePromotions(props) {
    const token = useSelector((state) => state.token.value);

    const [validated, setValidated] = useState(false)
    const [contents, setContents] = useState({pid: null, promotionName: "", message: ""});
    const [promotions, setPromotions] = useState([])
    const [promotionIndex, setPromotionIndex] = useState(-1)
    const [modifyModal, showModifyModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [modifyTitle, setModifyTitle] = useState("")
    const [showAdminInfo, setAdminInfo] = useState(false)
    const [allowSubmit,disableSubmit] = useState(false)
    const [ready, setReady] = useState(false)

    useEffect(() => { 
        // useEffect lets us fetch tables once the page is finished loading
        let promotions = []
        async function fetchTables() {
            // pull promotions table from the database
            await Axios.get("http://localhost:3001/getPromotions",{
                }).then((response) => {
                    if(response.data.err) {
                        console.log(response.data.err)
                    }
                    else if (response.data.message === "cannot fetch promotions") {
                        console.log(response.data.message)
                    } 
                    else {     
                        promotions = Array(response.data.data)[0]
                    }
            });

            
            if (props.role === "admin")
                setAdminInfo(true)
            
            setPromotions(promotions)
            setReady(true)
        }
        fetchTables()
    }, [props.role]);
    
    async function SetPromotionsTable() {
        let promotions = []
        // pull promotions table from the database
        await Axios.get("http://localhost:3001/getPromotions",{
        }).then((response) => {
            if(response.data.err) {
                console.log(response.data.err)
            }
            else if (response.data.message === "cannot fetch promotions") {
                console.log(response.data.message)
            } 
            else {     
                promotions = Array(response.data.data)[0]
            }
        });
        setPromotions(promotions)
    }

    const handleChange = (event) => {
        setContents({...contents, [event.target.id]: event.target.value})
    }

    // handle card buttons
    const handleCardClick = (event) => {
        disableSubmit(false)
        let mode = event.target.id.substring(0, 6) // get mode from button id
        let pid = Number(event.target.id.substring(7, event.target.id.length))
        if (mode === "delete") {
            showDeleteModal(true)
            let temp = contents
            temp.pid = pid // get iid from the last portion of button id
            setContents(temp)
        }
        else {
            showModifyModal(true)
            if (mode === "Modify") {
                setModifyTitle("Modify Promotion")
                let index = 0;
                for (index; index < promotions.length; index++) {
                    if (promotions[index].pid === pid) 
                        break
                }
                setPromotionIndex(index)
                setContents({pid: pid, promotionName: promotions[index].promotionName, message: promotions[index].message})
            }
            else {
                setModifyTitle("Create Promotion")
                setContents({pid: -1, promotionName: null, message: null})
            }
        }
    }

    // handle delete modal buttons
    const handleDeleteModal = async(event) => {
        disableSubmit(true)
        if (event.target.id === "delete_cancel")
            showDeleteModal(false) // cancel lets us just close the modal
        else { // delete car
            await Axios.post("http://localhost:3001/deletePromotion",{
                pid: contents.pid,
            }, {
                headers: {
                    authorization: token
                },
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message !== "Successful deletion!") {
                    console.log(response.data.message)
                } 
            });
            setTimeout(() => {showDeleteModal(false); SetPromotionsTable();}, 1000); //finished, give short time delay for feedback
        }
    }

    // handle modify modal buttons
    const handleModifyModal = async(event) => {
        let pid = contents.pid // get aid from contents array
        let mode = event.target.id
        if (mode === "Modify_cancel") { // if we are canceling, just close the window
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
            if (form.checkValidity() === true ) {
                if (modifyTitle === "Create Promotion") {
                    await Axios.post("http://localhost:3001/addPromotion",{
                        promotionName: contents.promotionName,
                        message: contents.message,
                    }, {
                        headers: {
                            authorization: token
                        },
                    }).then((response) => {
                        if(response.data.err) {
                            console.log(response.data.err)
                        }
                        else {     
                            Axios.get("http://localhost:3001/getPromotions",{
                            }).then((response) => {
                                if(response.data.err) {
                                    console.log(response.data.err)
                                }
                                else if (response.data.message === "cannot fetch promotions") {
                                    console.log(response.data.message)
                                } 
                                else {     
                                    // TO DO - SEND EMAIL TO ALL THOSE OPTED IN
                                    alert("INSERT SENDING PROMOTIONS EMAIL HERE")
                                    setTimeout(() => {setValidated(false); showModifyModal(false); SetPromotionsTable();}, 1000);
                                }
                            });
                        }
                    });
                }
                else if (modifyTitle === "Modify Promotion") {       
                    
                    let changed = contents.promotionName !== promotions[promotionIndex].name 
                    || contents.message !== promotions[promotionIndex].message;
                    if (changed) {
                        await Axios.post("http://localhost:3001/editPromotion",{
                            pid: contents.pid,
                            promotionName: contents.promotionName,
                            message: contents.message
                        }, {
                            headers: {
                                authorization: token
                            },
                        }).then((response) => {
                            if(response.data.err) {
                                console.log(response.data.err)
                            }
                            else if (response.data.message === "promotion does not exist in inventory!") {
                                console.log(response.data.message)
                            } 
                            else {    
                                setTimeout(() => {setValidated(false); showModifyModal(false); SetPromotionsTable()}, 1000);
                            } 
                        });
                    }
                    else 
                        setTimeout(() => {setValidated(false); showModifyModal(false);}, 1000);
                }
                else
                    disableSubmit(false)
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
                <Form.Group as={Row} className="mb-3" controlId="promotionName">
                    <Form.Label column sm="3" className="createAccountLabels">Promotion Name</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.promotionName}
                            type = "text"
                            placeholder="Promotion Name"
                            onChange={handleChange}
                        />
                    </Col>                  
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="message">
                    <Form.Label column sm="3" className="createAccountLabels">Message</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.message}
                            type = "text"
                            placeholder="Message"
                            onChange={handleChange}
                        />
                    </Col>                           
                </Form.Group> 
                <div style={{textAlign: 'center'}}>
                    <Button type = "submit" disabled = {allowSubmit} variant="primary" size='sm' style={{margin: '5px'}}>Confirm</Button>
                    <Button id="Modify_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleModifyModal}>Cancel</Button>  
                </div>                                       
            </Form>    
        </Modal.Body>                   
        </Modal>

        <Modal show={deleteModal} centered id = "deleteModal">
        <Modal.Header >
        <Modal.Title>Delete Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Are you sure you want to delete this promotion?</p>
                <div style={{textAlign: 'center'}}>
                    <Button id="delete_confir" disabled = {allowSubmit} variant="primary" size='sm' style={{margin: '5px'}} onClick={handleDeleteModal}>Confirm</Button>
                    <Button id="delete_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleDeleteModal}>Cancel</Button>
                </div>
        </Modal.Body>                   
        </Modal>
        <div >
            <GenerateAppsList promotions = {promotions}/>
        </div>
        <br></br>
        <Button className="btn" id = "Create" style={{ display: (showAdminInfo ? 'block': 'none'), margin:"auto"}} onClick={handleCardClick}>Create New Promotion</Button>
        </div>
        </>
    );

    function GenerateAppsList(props) {
        let promotions = props.promotions
        
        const GenerateList = ((promotion, index) => {
            return (
                <>
                <Card id = {"card_"+promotion.pid} style = {{width: window.innerWidth/3, margin:"15px"}} className = "box">
                <Card.Body>
                    <ListGroup className="list-group-flush" style = {{textAlign: "center"}}>
                        <Card.Title style = {{fontSize: "20px", fontWeight: "bold"}}>{promotion.promotionName}</Card.Title>
                        <ListGroupItem style = {{marginTop: "-10px"}}></ListGroupItem>
                        <ListGroupItem style = {{fontSize: "22px", fontWeight: "600"}}>{promotion.message}</ListGroupItem>
                    </ListGroup> 
                    
                </Card.Body>
                <div style = {{display: (showAdminInfo ? 'block': 'none'), textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>
                    <Button id = {"Modify-"+promotion.pid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify</Button>   
                    <Button id = {"delete-"+promotion.pid} style = {{marginLeft: '5px'}} variant="danger" onClick={handleCardClick}>Delete</Button>
                </div>
                </Card>
                </>
            )
        });
        return <div className = "grid" >{promotions.map(GenerateList)}</div>
    }
}

export default MakePromotions