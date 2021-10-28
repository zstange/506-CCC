import React, {useState} from "react"; 
// import Axios from 'axios';
import './CreateAccount.css';
import { Form, Button, Row, Col} from "react-bootstrap";

function CreateAccountForm() {
    const [validated, setValidated] = useState(false);
    const [contents, setContents] = useState({FirstName: "", LastName: "", Email: "", Password: "", PhoneNumber: ""});
    const [emailError, setEmailError] = useState("Please enter a valid email.")
    const [emailRegex, setEmailRegex] = useState("\\S*");

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
        }
        
        setValidated(true);
        
        // database check skeleton code, for the sake of example a@a will be an email that already has an account

        if (contents.Email === "a@a") {// database check will be used the if statement boolean 
            setEmailRegex("^(?!"+contents.Email+"$).*$") // set regex reject the email if it's already being used
            setEmailError("This email is already being used.")
        }
        else { // otherwise regex should work as normal (note the type = email within the form ensures emails are formatted correctly)
            setEmailRegex("\\S*"); 
            setEmailError("Please enter a valid email.")
        }
        
        // Output Caputured Data
        if (form.checkValidity() === true) {
            console.log("success")
            // TODO
            let data = contents;
            data.PhoneNumber = data.PhoneNumber.replace(/[^\d]/g, ''); // clean up phone number
            // insert database population here
        }          
    };

    const handleChange = (event) => {
        if (event.target.id === "PhoneNumber") // format phone number changes
            event.target.value = formatPhoneNumber(event.target.value);
        setContents({...contents, [event.target.id]: event.target.value.trim()});
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
                    <Form.Group as={Row} className="mb-3" value = {contents.FirstName} controlId="FirstName" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">First Name</Form.Label>
                        <Col sm="9" >
                            <Form.Control  
                            required
                            type="text"
                            placeholder="First name"
                            />
                        </Col>                    
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" value = {contents.LastName} controlId="LastName" onChange = {handleChange}>
                        <Form.Label column sm="3" className="createAccountLabels">Last Name</Form.Label>
                        <Col sm="9">
                            <Form.Control
                            required
                            type= "text"
                            placeholder="Last name"
                            />
                        </Col>                    
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" value = {contents.Email} controlId="Email" onChange = {handleChange}>
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

                    <Form.Group as={Row} className="mb-3" value = {contents.Password} controlId="Password" onChange = {handleChange}>
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

                    <Form.Group as={Row} className="mb-3" value = {contents.PhoneNumber} controlId="PhoneNumber" onChange = {handleChange}>
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

// adds formating to phone number to make it look nicer in the form
function formatPhoneNumber(phoneNumber) {
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
        <div>
          <Row>
            <CreateAccountForm/>
          </Row>
        </div>   
      </>
    );
  }
}

export default CreateAccount;