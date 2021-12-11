import React, {useEffect,useState} from "react"; 
import { useSelector } from "react-redux";
import '../css/CustomerHistory.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakeHistoryCards from "./MakeHistoryCards";
import MakeAdminHistory from "./MakeAdminHistory";
import { Row} from "react-bootstrap";


function CustomerHistory() {
    const role = useSelector((state) => state.role.value);
    const uid = useSelector((state) => state.userId.value);

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
                <div className="List">     
                    <MakeHistoryCards uid = {uid} aid = {null} role = {"user"}/>
                </div>     
            </Row> 
            </>
        );
    } 
}

export default CustomerHistory;