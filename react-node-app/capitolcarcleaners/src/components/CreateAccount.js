import React, {useState} from "react"; 
import Axios from 'axios';
import '../css/CreateAccount.css';
import { Form, Button, Row, Col} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'
import { Redirect } from 'react-router-dom';

function CreateAccountForm() {
    const [validated, setValidated] = useState(false);
    const [contents, setContents] = useState({firstName: "", lastName: "", email: "", password: "", phoneNumber: "", receivePromotions: false});
    const [emailError, setEmailError] = useState("Please enter a valid email.")
    const [emailRegex, setEmailRegex] = useState("\\S*");
    const [successMsg, setSuccessMsg] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false)
    
    const handleSubmit = async(event) => {
        const form = event.currentTarget;
        event.preventDefault()
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        setValidated(true);

        let emailExists = true; // assume email exists until proven otherwise

        if (form.checkValidity()) { // check if form is properly formatted

            // check if email exists
            emailExists = await Axios.post("http://localhost:3001/checkEmail",{
                email: contents.email,
                }).then((response) => {
                    if(response.data.err) {
                        console.log(response.data.err)
                    }
                    else if (response.data.message) {
                        console.log(response.data.err)
                    } else {     
                        return response.data.value
                    }
            });
                
            if (emailExists) {
                setEmailRegex("^(?!"+contents.email+"$).*$") // set regex to reject the email if it's already being used
                setEmailError("This email is already being used.");
            }
            else {
                let data = contents;
                data.phoneNumber = data.phoneNumber.replace(/[^\d]/g, ''); // clean up phone number
                
                // database population
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
                    }
                    else if (response.data.message) { // print failure messages
                        console.log(response.data.message);
                    } else { // successful account creation
                        setDisableSubmit(true)
                        setSuccessMsg("Success, account created!") 
                        // short time delay to let user see the success message
                        setTimeout(() => {  setRedirect(true); }, 2000);
                    }
                });
                         
            }    
        }
        else { // badly formatted form
            setEmailRegex("\\S*"); 
            setEmailError("Please enter a valid email.");
        }
     
    };

    const handleChange = (event) => {
        if (event.target.id === "receivePromotions") {
            setContents({...contents, [event.target.id]: event.target.checked});
        }
        else {
            if (event.target.id === "phoneNumber") // format phone number changes
                event.target.value = formatphoneNumber(event.target.value);
            else if (event.target.id === "email")
                setEmailError("")
            setContents({...contents, [event.target.id]: event.target.value.trim()});
        }
    };

    return (
        <>
            <Row>
            <div>
                <h1 className="createAccountHeaders">Create Account</h1>
            </div>
            </Row>
            
            <Row style={{padding: '5%'}}>
            <div >            
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <h4 className="createAccountLabels mb-3">Personal Information:</h4>
                    <Form.Group as={Row} className="mb-3" value = {contents.firstName} controlId="firstName" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">First Name</Form.Label>
                        <Col sm="9" >
                            <Form.Control  
                            required
                            type="text"
                            placeholder="First name"
                            />
                        </Col>                    
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" value = {contents.lastName} controlId="lastName" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">Last Name</Form.Label>
                        <Col sm="9">
                            <Form.Control
                            required
                            type= "text"
                            placeholder="Last name"
                            />
                        </Col>                    
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" value = {contents.email} controlId="email" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">Email Address</Form.Label>
                        <Col sm="9">
                            <Form.Control 
                            required 
                            type= "email" 
                            pattern = {emailRegex}
                            placeholder="Enter email" 
                            />
                            <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                        </Col>            
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" value = {contents.password} controlId="password" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">Create Password</Form.Label>
                        <Col sm="9">
                            <Form.Control 
                            required
                            type= "password" 
                            placeholder="Enter password" 
                            />
                        </Col>
                        <Form.Control.Feedback type="invalid">Please enter a password.</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" value = {contents.phoneNumber} controlId="phoneNumber" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">Phone Number</Form.Label>
                        <Col sm="9">
                            <Form.Control
                            required
                            pattern="\({1}\d{3}\){1}-{1}\d{3}-{1}\d{4}"
                            type="text"
                            placeholder="(XXX)-XXX-XXXX"
                            />
                            <Form.Control.Feedback type="invalid">Please enter a valid phone number.</Form.Control.Feedback>
                        </Col>                    
                    </Form.Group>                  
                    <div>
                        <input id = "receivePromotions" type="checkbox" onChange = {handleChange} /> - I would like to receive promotions
                    </div>
                    <div style={{color: "green"}}>
                        {successMsg}
                    </div>
                    { redirect ? (<Redirect to={{ pathname: '/Login', state: {} }}/>) : null }
                    <Button className="m-4" disabled = {disableSubmit} type="submit" size="lg" style={{display: 'inline-block'}}>Submit</Button> 
                </Form>
                
                <div >
                    <Link to="/">
                        <Button id="cancel" className="btn btn-danger btn-lg" style={{display: 'inline-block'}}>Cancel</Button>
                    </Link>
                </div>         
            </div>     
            </Row> 
        </>
    );
}

// adds formating to phone number to make it look nicer in the form
function formatphoneNumber(phoneNumber) {
    let phoneNum = phoneNumber.replace(/[^\d]/g, '').trim(); 
    let final = "(";
    if (phoneNum.length === 0) {
        return "";
    }
    if (phoneNum.length > 10)
        phoneNum = phoneNum.slice(0,10)

    for (let i = 0; i < phoneNum.length; i++) {
        if (i === 2)
            final = final.concat(phoneNum[i]);
        else if (i === 3)
            final = final.concat(")-"+phoneNum[i]);
        else if (i === 6)
            final = final.concat("-"+phoneNum[i]);
        else 
            final = final.concat(phoneNum[i]);         
    }
    return final;
}

class CreateAccount extends React.Component {

  render() {
    return (
      <> 
        <div className = "App">
        <Row>   
            <CreateAccountForm/>
        </Row>
        </div> 
      </>
    );
  }
}

export default CreateAccount;