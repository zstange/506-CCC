import React, {useState} from "react"; 
// import Axios from 'axios';
import './CreateAccount.css';
import { Form, Button, Row, Col} from "react-bootstrap";

function CheckEmail() {
    const [validated, setValidated] = useState(false);
    const [contents, setContents] = useState({Email: ""});
    const [emailError, setEmailError] = useState("Please enter a valid email")
    const [emailRegex, setEmailRegex] = useState("\\S*");
    const [allowPasswordReset, setPasswordReset] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }
        
        setValidated(true);
        
        if (contents.Email === "a@a") {// database check will be used as the if statement boolean 
            setPasswordReset(true)
            event.preventDefault();
        }
        else if (form.checkValidity() === true || contents.Email.match(emailRegex) === null) { // properly formatted email, but not in database
            event.preventDefault();
            setEmailRegex("^(?!"+contents.Email+"$).*$") // set regex to reject the email
            setEmailError("No account exists with this email.")
        }
        else {
            setEmailRegex("\\S*")
            setEmailError("Please enter a valid email.");
        }  

    };

    const handleChange = (event) => {
        setContents({...contents, [event.target.id]: event.target.value.trim()});
    };

    if (!allowPasswordReset) {
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
                        <Form.Group as={Row} className="mb-3" value = {contents.Email} controlId="Email" onChange = {handleChange}>
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
                        <a href="/" id="cancel" name="cancel" className="btn btn-danger btn-lg" style={{display: 'inline-block'}}>Cancel</a>
                    </div>         
                </div>     
                </Row> 
            </>
        );
    }
    else {
        return (
           <PasswordReset />
        );
    }
    
}

function PasswordReset() {
    const [validated, setValidated] = useState(false);
    const [contents, setContents] = useState({Password: ""});
    const [message, setMessage] = useState("");

    const timer = setTimeout(() => console.log('Initial timeout!'), 5000);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }
        
        setValidated(true);
        
        if(form.checkValidity()) {
            // insert password being updated in database here and then redirect back to login
            // maybe add a time delay so the user can see the success message or just throw an alert?
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
                    <Form.Group as={Row} className="mb-3" controlId="Password" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">New Password</Form.Label>
                        <Col sm="7" >
                            <Form.Control  
                            required
                            type = "text"
                            placeholder="Enter new password"
                            />
                            <Form.Control.Feedback>Password changed, redirecting back to login page</Form.Control.Feedback>
                        </Col>                    
                        
                    </Form.Group>                                
                    <Button className="m-4" type="submit" size="lg" style={{display: 'inline-block'}}>Reset Password</Button>          
                </Form>

                <div >
                    <a href="/" id="cancel" name="cancel" className="btn btn-danger btn-lg" style={{display: 'inline-block'}}>Cancel</a>
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
        <div>
          <Row>
            <CheckEmail/>
          </Row>
        </div>   
      </>
    );
  }
}

export default ForgotPassword;