import React, {useEffect,useState} from "react"; 
import Axios from 'axios';
import { useSelector } from "react-redux";
import '../css/CustomerHistory.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakeHistoryCards from "./MakeHistoryCards";
import MakeAdminHistory from "./MakeAdminHistory";
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";


function CustomerHistory() {
    const role = useSelector((state) => state.role.value);
    const uid = useSelector((state) => state.uid.value);

    if (role === "admin") { // role check
        return (
            <>
            <Row style={{padding: '1%'}}>
                <div className = "List">     
                   <MakeAdminHistory/>
                </div>     
            </Row> 
            </>
        );
    }
    else {
        return (
            <>
            <Row style={{padding: '1%'}}>
                <label className="AllAppHeader">Service History</label>
                <div className="List">     
                    <MakeHistoryCards uid = {uid} aid = {null} role = {"user"}/>
                </div>     
            </Row> 
            </>
        );
    } 
}

export default CustomerHistory;