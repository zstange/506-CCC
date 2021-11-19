import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/VehiclesForSale.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakeAdminVehiclesForSale from './MakeAdminVehiclesForSale';
import MakeVehiclesForSale from './MakeVehiclesForSale';
import { useSelector } from "react-redux";
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal, Image, Carousel} from "react-bootstrap";

function VehiclesForSale() { 
    const role = useSelector((state) => state.role.value);

    if (role === "admin") { // role check
        return (
            <>
            <Row style={{padding: '1%'}}>
                <div className = "List">    
                    <label className="AllAppHeader">Cars For Sale</label>
                    <MakeAdminVehiclesForSale/>
                </div>     
            </Row> 
            </>
        );
    }
    else {
        return (
            <>
            <Row style={{padding: '1%'}}>
                <div className = "List">     
                    <label className="AllAppHeader">Cars For Sale</label>
                    <MakeVehiclesForSale role = {"user"}/>
                </div>     
            </Row> 
            </>
        );
    }
}

export default VehiclesForSale;