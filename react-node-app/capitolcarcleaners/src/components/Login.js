import React, {useState} from "react"; 
import Axios from 'axios';
import '../css/Login.css';
import { Form, Button, Row, Col} from "react-bootstrap";
import {LinkContainer as Link} from 'react-router-bootstrap'
import { Redirect } from 'react-router-dom';

function LoginPage(props) {
  const [validated, setValidated] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setValidated(true);
    
    // Output Caputured Data
    if (form.checkValidity() === true) {
      event.preventDefault();
      Axios.post("http://localhost:3001/login",{
        email: event.target.elements.email.value,
        password: event.target.elements.password.value,
        }).then((response) => {
          console.log(response)
          if(response.data.err){
            alert(response.data.err);
          } 
          else if (response.data.message){
            alert(response.data.message);
          } 
          else {
            alert("HELLO?")
            setRedirect(true);
          }
        });
      
      }
    }   

  return (
      <>          
          <Row style={{padding: '2%'}}>
          <div >            
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group as={Row} className="mb-3" controlId="validationEmail">
                      <Form.Label column sm="3" className="createAccountLabels">Email</Form.Label>
                      <Col sm="9" >
                          <Form.Control 
                          required
                          type="email"
                          name="email"
                          placeholder="Email address"
                          />
                      </Col>                    
                  </Form.Group>

                  <Form.Group as={Row} className="mb-1" controlId="validationPassword">
                      <Form.Label column sm="3" className="createAccountLabels">Password</Form.Label>
                      <Col sm="9">
                          <Form.Control
                          required
                          type="password"
                          name="password"
                          placeholder="Password"
                          />
                      </Col>                    
                  </Form.Group>

                  { redirect ? (<Redirect to={{ pathname: '/Home'}}/>) : null }
                  <Button className="m-4" type="submit" style={{display: 'inline-block'}}>Submit</Button>  
                      
              </Form>  
              <div>
                <Link to="/ForgotPassword">
                <Button className="m-4 btn-sm" type="button" >Forgot Password</Button>
                </Link>
              </div>   
                 
          </div>
     
          </Row> 
      </>
  );
}

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: '', email: "", password: ""};  /* state array */
  }

  render() {
    return (
      <>
        <LoginPage/>
        <div> 
          <div>
                <p className="loginText">Don't have an account yet?</p>
          </div> 
          <Link to="/CreateAccount">
            <Button variant="info">Create Account</Button>
          </Link>        
		    </div>   
      </>
    );
  }
}

export default Login;