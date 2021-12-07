import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/VehiclesForSale.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakePromotions from './MakePromotions';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal, Image, Carousel} from "react-bootstrap";

function MakeAdminVehiclesForSale() {

    const [promotionsTable, setPromotionsTable] = useState([])
    const [ready,setReady] = useState(false)

    return (
        <div>
            <MakePromotions role = {"admin"} setPromotions = {setPromotionsTable} promotions = {promotionsTable}/>
        </div>
    );
}

export default MakeAdminVehiclesForSale