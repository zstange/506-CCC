import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/VehiclesForSale.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal, Image, Carousel} from "react-bootstrap";

function MakeVehiclesForSale(props) {
    const [validated, setValidated] = useState(false)
    const [contents, setContents] = useState({iid: null, price: null, make: "", model: "", year: null, color: "", additionalInfo: "", image: ""});
    const [vehicles, setVehicles] = useState([])
    const [vehicleIndex, setVehicleIndex] = useState(-1)
    const [hasImage, setHasImage] = useState(false)
    const [imageRegex, setImageRegex] = useState("")
    const [modifyModal, showModifyModal] = useState(false)
    const [deleteModal, showDeleteModal] = useState(false)
    const [modifyTitle, setModifyTitle] = useState("")
    const [showAdminInfo, setAdminInfo] = useState(false)
    const [allowSubmit,disableSubmit] = useState(false)
    const [ready, setReady] = useState(false)
    const [images, setImages] = useState([])
    const [vehicleImages, setVehicleImages] = useState([])

    useEffect(() => { 
        // useEffect lets us fetch tables once the page is finished loading
        let vehicles = []
        async function fetchTables() {
            // pull vehicles table from the database
            await Axios.get("http://localhost:3001/getInventory",{
                }).then((response) => {
                    if(response.data.err) {
                        console.log(response.data.err)
                    }
                    else if (response.data.message) {
                        console.log(response.data.err)
                    } 
                    else {     
                        vehicles = Array(response.data.data)[0]
                    }
            });

            let images = [] // temporary array so we can set the table state later    
            await Axios.post("http://localhost:3001/getImages",{
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.err)
                } 
                else {     
                    images = Array(response.data.data)[0]
                }
            });
            
            if (props.role === "admin")
                setAdminInfo(true)
            
            setVehicles(vehicles)
            setImages(images)
            setReady(true)
        }
        fetchTables()
    }, [props.role]);
    
    async function SetTables() {
        let vehicles = []
        await Axios.get("http://localhost:3001/getInventory",{
        }).then((response) => {
            if(response.data.err) {
                console.log(response.data.err)
            }
            else if (response.data.message) {
                console.log(response.data.err)
            } 
            else {     
                vehicles = Array(response.data.data)[0]
            }
    });

        let images = [] // temporary array so we can set the table state later    
        await Axios.post("http://localhost:3001/getImages",{
        }).then((response) => {
            if(response.data.err) {
                console.log(response.data.err)
            }
            else if (response.data.message) {
                console.log(response.data.err)
            } 
            else {     
                images = Array(response.data.data)[0]
            }
        });
        setVehicles(vehicles)
            setImages(images)
    }

    const handleAddImage = (event) => {
        if (contents.image !== "") {
            setContents({...contents, [event.target.id]: ""})
            let temp = vehicleImages          
            temp.push({imageid: -1, iid: -1, url: contents.image})
            setVehicleImages(temp)
            if (temp.length === 0) {
                setHasImage(false)
                setImageRegex("^(?!"+contents.image+"$).*$")
            }
            else   {
                setHasImage(true)
                setImageRegex("\\S*")
            }     
        }   
        
    }

    const handleDeleteImage = (event) => {
        let temp = vehicleImages.filter(img => img.imageid !== Number(event.target.id))
        setVehicleImages(temp)
        if (temp.length === 0) {
            setHasImage(false)
            setImageRegex("^(?!"+contents.image+"$).*$")
        }
        else   {
            setHasImage(true)
            setImageRegex("\\S*")
        }
    }

    const handleChange = (event) => {
        
        if (event.target.id.substring(0,6) === "image_") {
            let temp = vehicleImages            
            temp[Number(event.target.id.substring(7,event.target.id.length))].url = event.target.value
            setVehicleImages(temp)
        }
        else
            setContents({...contents, [event.target.id]: event.target.value})
    }

    // handle card buttons
    const handleCardClick = (event) => {
        disableSubmit(false)
        let mode = event.target.id.substring(0, 6) // get mode from button id
        let iid = Number(event.target.id.substring(7, event.target.id.length))
        if (mode === "delete") {
            showDeleteModal(true)
            let temp = contents
            temp.iid = iid // get iid from the last portion of button id
            setContents(temp)
        }
        else {
            showModifyModal(true)
            if (vehicleImages.length < 0) {
                setHasImage(false)
                setImageRegex("^(?!"+contents.image+"$).*$")
            }
            else   {
                setHasImage(true)
                setImageRegex("\\S*")
            }

            if (mode === "Modify") {
                setModifyTitle("Modify Vehicle Listing")
                let index = 0;
                for (index; index < vehicles.length; index++) {
                    if (vehicles[index].iid === iid) 
                        break
                }
                setVehicleIndex(index)
                setContents({iid: iid, price: vehicles[index].price, make: vehicles[index].make, model: vehicles[index].model,
                    year: vehicles[index].year, color: vehicles[index].color, additionalInfo: vehicles[index].additionalInfo
                    ,image: ""})
                let temp = images.filter(image => image.iid === iid)
                setVehicleImages(temp)
            }
            else {
                setModifyTitle("Create Vehicle Listing")
                setContents({iid: null, price: null, make: "", model: "", year: null, color: "", additionalInfo: "", image: ""})
                setVehicleImages([])
                setHasImage(false)
            }
        }
    }

    // handle delete modal buttons
    const handleDeleteModal = async(event) => {
        disableSubmit(true)
        let iid = contents.iid // get aid from contents array
        if (event.target.id === "delete_cancel")
            showDeleteModal(false) // cancel lets us just close the modal
        else { // delete car
            await Axios.post("http://localhost:3001/deleteImages",{
                iid: contents.iid,
            }).then((response) => {
                if(response.data.err) {
                    console.log(response.data.err)
                }
                else if (response.data.message) {
                    console.log(response.data.err)
                } 
                else {     
                    setVehicles(vehicles.filter(vehicle => vehicle.iid !== iid))
                    Axios.post("http://localhost:3001/deleteInventory",{
                        iid: contents.iid,
                    }).then((response) => {
                        if(response.data.err) {
                            console.log(response.data.err)
                        }
                        else if (response.data.message) {
                            console.log(response.data.err)
                        } 
                    });
                    setTimeout(() => {showDeleteModal(false)},1000); //finished, give short time delay for feedback
                }
            });
        }
    }

    // handle modify modal buttons
    const handleModifyModal = async(event) => {
        let iid = contents.iid // get aid from contents array
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
            if (vehicleImages.length === 0) {
                setHasImage(false)
                setImageRegex("^(?!"+contents.image+"$).*$")
            }
            else   
                setImageRegex("\\S*")
            if (form.checkValidity() === true ) {
                if (modifyTitle === "Create Vehicle Listing" && hasImage) {
                    await Axios.post("http://localhost:3001/addInventory",{
                        price: contents.price,
                        make: contents.make,
                        model: contents.model,
                        year: contents.year,
                        color: contents.color,
                        additionalInfo: contents.additionalInfo,
                    }).then((response) => {
                        if(response.data.err) {
                            console.log(response.data.err)
                        }
                        else if (response.data.message) {
                            console.log(response.data.err)
                        } 
                        else {     
                            Axios.get("http://localhost:3001/getInventory",{
                            }).then((response) => {
                                if(response.data.err) {
                                    console.log(response.data.err)
                                }
                                else if (response.data.message) {
                                    console.log(response.data.err)
                                } 
                                else {     
                                    let temp = Array(response.data.data)[0]
                                    for (let i = 0; i <vehicleImages.length; i++) {
                                        Axios.post("http://localhost:3001/addImage",{
                                            iid: temp[temp.length-1].iid,
                                            url: vehicleImages[i].url
                                        }).then((response) => {
                                            if(response.data.err) {
                                                console.log(response.data.err)
                                                i = vehicleImages.length
                                            }
                                            else if (response.data.message) {
                                                console.log(response.data.err)
                                                i = vehicleImages.length
                                            } 
                                        });
                                    }
                                    setTimeout(() => {setValidated(false); showModifyModal(false); SetTables();}, 1000);
                                }
                            });
                        }
                    });
                }
                else if (modifyTitle === "Modify Vehicle Listing") {       
                    let oldVehicleImages = images.filter(image => image.iid === contents.iid)
                    let imageChange = oldVehicleImages.length !== vehicleImages.length
                    if (!imageChange) {
                        let i = oldVehicleImages.length
                        while(i-- && !imageChange) {
                            if (oldVehicleImages[i].url !== vehicleImages[i].url) {
                                imageChange = true
                            }
                        }
                    }
                    
                    let changed = contents.iid !== vehicles[vehicleIndex].iid || contents.price !== vehicles[vehicleIndex].price 
                    || contents.make !== vehicles[vehicleIndex].make || contents.model !== vehicles[vehicleIndex].model 
                    || contents.year !== vehicles[vehicleIndex].year || contents.color !== vehicles[vehicleIndex].color 
                    || contents.additionalInfo !== vehicles[vehicleIndex].additionalInfo || imageChange
                    alert(changed)
                    if (changed) {
                        await Axios.post("http://localhost:3001/editInventory",{
                            iid: contents.iid,
                            price: contents.price,
                            make: contents.make,
                            model: contents.model,
                            year: contents.year,
                            color: contents.color,
                            additionalInfo: contents.additionalInfo,
                        }).then((response) => {
                            if(response.data.err) {
                                console.log(response.data.err)
                            }
                            else if (response.data.message) {
                                console.log(response.data.err)
                            } 
                            else {    
                                if(imageChange) {
                                    Axios.post("http://localhost:3001/deleteImages",{
                                    iid: contents.iid,
                                    }).then((response) => {
                                        if(response.data.err) {
                                            console.log(response.data.err)
                                        }
                                        else if (response.data.message) {
                                            console.log(response.data.err)
                                        } 
                                        else {
                                            for (let i = 0; i <vehicleImages.length; i++) {
                                                Axios.post("http://localhost:3001/addImage",{
                                                    iid: contents.iid,
                                                    url: vehicleImages[i].url
                                                }).then((response) => {
                                                    if(response.data.err) {
                                                        console.log(response.data.err)
                                                        i = vehicleImages.length
                                                    }
                                                    else if (response.data.message) {
                                                        console.log(response.data.err)
                                                        i = vehicleImages.length
                                                    } 
                                                });
                                            }
                                            setTimeout(() => {setValidated(false); showModifyModal(false); SetTables();}, 1000);
                                        }
                                    });       
                                }
                                else 
                                    setTimeout(() => {setValidated(false); showModifyModal(false);SetTables()}, 1000);
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
                <Form.Group as={Row} className="mb-3" controlId="price">
                    <Form.Label column sm="3" className="createAccountLabels">Price</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.price}
                            pattern = "^\d+.{0,1}\d{0,2}"
                            type = "text"
                            placeholder="Price"
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Must be proper dollar amount.</Form.Control.Feedback>    
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
                            pattern = "^\d+"
                            type = "text"
                            placeholder="Year"
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Must be proper year.</Form.Control.Feedback>   
                    </Col>                         
                </Form.Group> 
                <Form.Group as={Row} className="mb-3" controlId="color">
                    <Form.Label column sm="3" className="createAccountLabels">Color</Form.Label>
                    <Col sm="7" >
                        <Form.Control  
                            required
                            value = {contents.color}
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
                    <div>
                    <Form.Label column sm="3" className="createAccountLabels">New Image</Form.Label>
                    <Col sm="7" style = {{display: "inline-block"}}>
                        <Form.Control  
                            required = {!hasImage}
                            pattern =  {imageRegex}
                            value = {contents.image}
                            type = "text"
                            placeholder="Image Link"
                            onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">Add at least one image.</Form.Control.Feedback>    
                    </Col>   
                    <Button id="image" variant="primary" size='sm' style={{marginLeft: '200px', marginTop: '10px'}} onClick={handleAddImage}>Add Image</Button>
                    </div>                        
                </Form.Group> 
                {vehicleImages.map((image, index) => {
                    return <div>
                            <Form.Group as={Row} className="mb-3" controlId={"image_"+image.imageid}>
                            <Form.Label column sm="3" className="createAccountLabels">{"Image "+index+1}</Form.Label>
                            <Col sm="7" >
                                <Form.Control  
                                    readOnly
                                    value = {image.url}
                                    type = "text"
                                    placeholder="Image Link"
                                    onChange={handleChange}
                                />
                            </Col>                           
                            </Form.Group>
                            <Button id={image.imageid} variant="primary" size='sm' style={{marginLeft: '200px', marginBottom: '25px'}} onClick={handleDeleteImage}>Delete Image</Button>
                            </div>
                })}
                <div style={{textAlign: 'center'}}>
                    <Button type = "submit" disabled = {allowSubmit} variant="primary" size='sm' style={{margin: '5px'}}>Confirm</Button>
                    <Button id="Modify_cancel" variant="secondary" size='sm' style={{margin: '5px'}} onClick={handleModifyModal}>Cancel</Button>  
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
            <GenerateAppsList vehicles = {vehicles} images = {images}/>
        </div>
        <br></br>
        <Button className="btn" id = "Create" style={{ display: (showAdminInfo ? 'block': 'none'), margin:"auto"}} onClick={handleCardClick}>Create Vehicle Listing</Button>
        </div>
        </>
    );

    function GenerateAppsList(props) {
        let vehicles = props.vehicles
        
        const GenerateList = ((vehicle, index) => {
            let vehImages = props.images.filter(image => image.iid === vehicle.iid)
            return (
                <>
                <Card id = {"card_"+vehicle.iid} style = {{width: window.innerWidth/3, margin:"15px"}} className = "box">
                <Card.Body>
                    <ListGroup className="list-group-flush" style = {{textAlign: "center"}}>
                        <Card.Title style = {{fontSize: "20px", fontWeight: "bold"}}>{vehicle.color+" "+vehicle.year+" "+vehicle.make+" "+vehicle.model}</Card.Title>
                        <ListGroupItem style = {{marginTop: "-10px"}}></ListGroupItem>
                        <ListGroupItem style = {{fontSize: "22px", fontWeight: "600"}}>{"$"+vehicle.price.toFixed(2)}</ListGroupItem>
                        <Carousel style={{margin: '20px'}}>
                            {vehImages.map((image) => {
                                    return <Carousel.Item interval={6000}>
                                    <Image
                                        style={{ width: '550px', height: "425px"}}
                                        src={image.url}
                                        rounded
                                    />
                                    </Carousel.Item>
                            })}
                        </Carousel>
                        <ListGroupItem style = {{fontSize: "15px", textAlign: "left"}}>
                            <label style={{fontSize: "15px", fontWeight: "500"}}>{"Additional Info:"}</label>{" "+vehicle.additionalInfo}</ListGroupItem>
                    </ListGroup> 
                    
                </Card.Body>
                <div style = {{display: (showAdminInfo ? 'block': 'none'), textAlign: 'center', marginTop: '-10px', marginBottom: '15px'}}>
                    <Button id = {"Modify-"+vehicle.iid} style = {{marginLeft: '-5px'}} onClick={handleCardClick}>Modify</Button>   
                    <Button id = {"delete-"+vehicle.iid} style = {{marginLeft: '5px'}} variant="danger" onClick={handleCardClick}>Delete</Button>
                </div>
                </Card>
                </>
            )
        });
        return <div className = "grid" >{vehicles.map(GenerateList)}</div>
    }
}

export default MakeVehiclesForSale