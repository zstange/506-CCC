import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import { useSelector } from "react-redux";
import MakeCards from './MakeCards.js';
import MakeAdminPage from "./MakeAdminPage.js";
import '../css/ViewAppointments.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";

function ViewAppointments() {
    const role = useSelector((state) => state.role.value);

    if (role === "admin"){
        return (
            <>
            <Row style={{padding: '1%'}}>
                <div className = "List">     
                   <MakeAdminPage/>
                </div>     
            </Row> 
            </>
        );
    } else {
        return (
            <>
            <Row style={{padding: '1%'}}>
                <div className="Grid">     
                    <MakeCards aid = {null} role = {"user"}/>
                </div>     
            </Row> 
            </>
        );
    }


}

export default ViewAppointments;