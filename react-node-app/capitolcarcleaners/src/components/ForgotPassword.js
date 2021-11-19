import React, {useState} from "react"; 
import Axios from 'axios';
import '../css/ForgotPassword.css';
import { Form, Button, Row, Col} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'
import { Redirect } from 'react-router-dom';

function CheckEmail() {
    const [validated, setValidated] = useState(false);
    const [contents, setContents] = useState({email: ""});
    const [emailError, setEmailError] = useState("Please enter a valid email")
    const [emailRegex, setEmailRegex] = useState("\\S*");
    const [resetPerm, setResetPerm] = useState(false);

    const handleSubmit = async(event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }
        
        setValidated(true);

        let emailExists = false; // assume email isn't in database until proven otherwise
        
        if (form.checkValidity() === true) {
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
                setResetPerm(true)
            }
            else {
                setEmailRegex("^(?!"+contents.email+"$).*$")
                setEmailError("No account exists with this email")
            }

        }
        else { // bad form or user hit submit on an email that was already shown not to be in the database
            if (contents.email.match(emailRegex) === null)
                setEmailError("No account exists with this email")
            else
                setEmailError("Please enter a valid email")
        }

    };

    const handleChange = (event) => {
        setContents({...contents, [event.target.id]: event.target.value.trim()});
        setEmailError("");
    };

    if (!resetPerm) {
        return (
            <>
                <Row>
                <div>
                    <h1 className="createAccountHeaders">Reset Password</h1>
                </div>
                </Row>
                
                <Row style={{padding: '5%'}}>
                <h4 className="createAccountLabels mb-3">Enter Account Email:</h4>
                <div >            
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" value = {contents.email} controlId="email" onChange = {handleChange}>
                            <Form.Label column sm="3" className="createAccountLabels">Account Email</Form.Label>
                            <Col sm="7" >
                                <Form.Control  
                                required
                                type = "email"
                                pattern = {emailRegex}
                                placeholder="Email Address"
                                />
                            <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                            </Col>                    
                           
                        </Form.Group>                                
                        <Button className="m-4" type="submit" size="lg" style={{display: 'inline-block'}}>Submit</Button>          
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
    else {
        return (
           <PasswordReset email={contents.email}/>
        );
    }
    
}

function PasswordReset(props) {
    const [validated, setValidated] = useState(false);
    const [contents, setContents] = useState({password: ""});
    const [successMsg, setSuccessMsg] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const handleSubmit = async(event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }

        setValidated(true);
        if(form.checkValidity()) { // if valid password, change the one in the database
            Axios.post("http://localhost:3001/forgotPassword",{
                email: props.email,
                password: contents.password
            }).then((response) => {
                if(response.data.err) { // print error messages
                    console.log(response.data.err);
                }
                else if (response.data.message === "Please fill out all information required.") { // print failure messages
                    console.log(response.data.message);
                } else { // successful password change
                    setDisableSubmit(true);
                    setSuccessMsg("Success, password changed!");
                    // short time delay to let user see the success message
                    setTimeout(() => { setRedirect(true) }, 2000);
                }
            });
        }
    };

    const handleChange = (event) => {
        setContents({...contents, [event.target.id]: event.target.value.trim()});
    };

    return (
        <>
            <Row>
            <div>
                <h1 className="createAccountHeaders">Reset Password</h1>
            </div>
            </Row>
            
            <Row style={{padding: '5%'}}>
            <h4 className="createAccountLabels mb-3">Enter New Password:</h4>
            <div >            
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="password" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">New Password</Form.Label>
                        <Col sm="7" >
                            <Form.Control  
                            required
                            type = "text"
                            placeholder="Enter new password"
                            />
                            <Form.Control.Feedback>{successMsg}</Form.Control.Feedback>
                        </Col>                    
                        
                    </Form.Group>    
                    { redirect ? (<Redirect to={{ pathname: '/Login', state: {} }}/>) : null }                            
                    <Button className="m-4" disabled = {disableSubmit} type="submit" size="lg" style={{display: 'inline-block'}}>Reset Password</Button>          
                </Form>

                <div >
                    <Link to="/Home">
                    <Button id="cancel" name="cancel" className="btn btn-danger btn-lg" style={{display: 'inline-block'}}>Cancel</Button>
                    </Link>
                </div>         
            </div>     
            </Row> 
        </>
    );
}

class ForgotPassword extends React.Component {
  render() {
    return (
        <>
          <Row>
          <div className="App">
              <CheckEmail/>
          </div> 
          </Row>  
        </>
      );
  }
}

export default ForgotPassword;