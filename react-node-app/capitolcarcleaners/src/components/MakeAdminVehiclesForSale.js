import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/VehiclesForSale.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakeVehiclesForSale from './MakeVehiclesForSale';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal, Image, Carousel} from "react-bootstrap";

function MakeAdminVehiclesForSale() {

    const [vehiclesTable, setVehiclesTable] = useState([])
    const [ready,setReady] = useState(false)

    return (
        <div>
            <MakeVehiclesForSale role = {"admin"} setVehicles = {setVehiclesTable} vehicles = {vehiclesTable}/>
        </div>
    );
}

export default MakeAdminVehiclesForSale