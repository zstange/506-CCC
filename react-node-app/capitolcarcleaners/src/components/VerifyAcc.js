import React, {useState} from "react"; 
import Axios from 'axios';
import '../css/CreateAccount.css';
import { Form, Button, Row, Col} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap';
import { Redirect } from 'react-router-dom';

function VerifyAcc(props) {
    const [validated, setValidated] = useState(false);
    const [contents, setContents] = useState({resetCode: ""});
    const [successMsg, setSuccessMsg] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const handleSubmit = async(event) => {
        setDisableSubmit(true);
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        if(form.checkValidity()) { 
            let data = props.contents;
            data.phoneNumber = data.phoneNumber.replace(/[^\d]/g, ''); // clean up phone number
            Axios.post("http://localhost:3001/CreateAccount",{
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
                email: data.email,
                phoneNumber: data.phoneNumber,
                role: "user",
                promotions: data.receivePromotions
            }).then((response) => {
                if(response.data.err) { // print error messages
                    console.log(response.data.err);
                    setDisableSubmit(false)
                } else { // successful account creation
                    setDisableSubmit(true)
                    setSuccessMsg("Success, account created!") 
                    // short time delay to let user see the success message
                    setTimeout(() => {  setRedirect(true)}, 2000);
                }
            });
        }
        else {
            setDisableSubmit(false);
        }
    };

    const handleChange = (event) => {
        setContents({...contents, [event.target.id]: event.target.value.trim()});
    };

    return (
        <>
            <Row style={{padding: '5%'}}>
            <div>
                <h1 className="createAccountHeaders" style ={{fontSize: "30px"}}>A verification code was sent to your email.</h1>
            </div>
            <br></br>
            <h4 className="createAccountLabels mb-3">Enter Verification Code:</h4>
            <div >            
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="password" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">Verification Code</Form.Label>
                        <Col sm="7" >
                            <Form.Control  
                            required
                            pattern = {String(props.code)}
                            type= "text" 
                            placeholder="Verification Code" 
                            />
                            <Form.Control.Feedback type="invalid">Incorrect verification code</Form.Control.Feedback>
                            <Form.Control.Feedback >{successMsg}</Form.Control.Feedback>
                        </Col>                    
                        
                    </Form.Group>    
                    { redirect ? (<Redirect to={{ pathname: '/Login', state: {} }}/>) : null }                            
                    <Button className="m-4" disabled = {disableSubmit} type="submit" size="lg" style={{display: 'inline-block'}}>Confirm</Button>          
                </Form>
                { redirect ? (<Redirect to={{ pathname: '/Login', state: {} }}/>) : null }
                <div >
                    <Link to="/Login">
                    <Button id="cancel" name="cancel" className="btn btn-danger btn-lg" style={{display: 'inline-block'}}>Cancel</Button>
                    </Link>
                </div>         
            </div>     
            </Row> 
        </>
    );
}

export default VerifyAcc