import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/VehiclesForSale.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakeVehiclesForSale from './MakeVehiclesForSale';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal, Image, Carousel} from "react-bootstrap";

function MakeAdminVehiclesForSale() {

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
            <div>
                <MakeVehiclesForSale role = {"admin"} setVehicles = {setVehiclesTable} vehicles = {vehiclesTable}/>
            </div>
        );
    }
    else {
        return (
          <label>loading...</label>  
        );
    }
}

export default MakeAdminVehiclesForSale