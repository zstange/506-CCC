import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import '../css/Promotions.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakeAdminPromotions from './MakeAdminPromotions';
import MakePromotions from './MakePromotions';
import { useSelector } from "react-redux";
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal, Image, Carousel} from "react-bootstrap";

function Promotions() { 
    const role = useSelector((state) => state.role.value);

    if (role === "admin") { // role check
        return (
            <>
            <Row style={{padding: '1%'}}>
                <div className = "List">    
                    <label className="AllAppHeader">Promotions</label>
                    <MakeAdminPromotions/>
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
                    <label className="AllAppHeader">Promotions</label>
                    <MakePromotions role = {"user"}/>
                </div>     
            </Row> 
            </>
        );
    }
}

export default Promotions;