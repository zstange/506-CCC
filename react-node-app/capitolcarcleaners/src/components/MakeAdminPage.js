import React, {useEffect,useState} from "react"; 
import { useSelector } from "react-redux";
import Axios from 'axios';
import MakeCards from './MakeCards.js';
import '../css/ViewAppointments.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";

function MakeAdminPage() {
  const token = useSelector((state) => state.token.value);

  const [appointments, setApps] = useState([])
  const [users,setUsers] = useState([])
  const [ready,setReady] = useState(false)

  useEffect(() => {
      // useEffect lets us fetch tables once the page is finished loading
      async function fetchTables() {
        console.log(token)
          await Axios.get("http://localhost:3001/getAppointmentsAdmin", {
            headers: {
                authorization: token
            },
          }).then((response) => {
              if(response.data.err) {
                  console.log(response.data.err)
              }
              else if (response.data.message) {
                  console.log(response.data.message)
              } 
              else {     
                  // populate temporary array
                  setApps(Array(response.data.data)[0])
              }
          });

          await Axios.get("http://localhost:3001/getUsers", {
            headers: {
                authorization: token
            },
          }).then((response) => {
              if(response.data.err) {
                  console.log(response.data.err)
              }
              else if (response.data.message) {
                  console.log(response.data.err)
              } 
              else {     
                  // populate temporary array
                  console.log((response.data.data)[0])
                  setUsers(Array(response.data.data)[0])
              }
          });
      }
      fetchTables()
      setReady(true)
  }, []);

  function GenerateTodaysModals() {
      let date = new Date()
      date.setHours(9,0,0,0)
      // filter appointments table to only show the ones on today's date at 9 am (9 am is hardcoded as the drop off time)
      let filteredApps = appointments.filter(app => new Date(app.dateTime).valueOf() === date.valueOf() && app.status !== "Picked Up") 

      // create a card for each filtered appointment and give it the user info
      const GenerateList = ((app, index) =>
          <MakeCards uid = {app.uid} firstName = {app.firstName} lastName = {app.lastName} email = {app.email} 
             phoneNumber = {app.phoneNumber} aid = {app.aid} setApps = {setApps} Apps = {appointments} role = {"admin"}/>
      );

      if (filteredApps.length === 0) { // if we don't have any appointments today just return a message saying so
          return (
              <div style={{marginBottom: "25px"}}>
                   <ListGroup className="list-group-flush">
                      <ListGroupItem></ListGroupItem>
                      <ListGroupItem style = {{fontSize: "20px"}}>No Appointments Today...</ListGroupItem>
                      <ListGroupItem></ListGroupItem>
                  </ListGroup> 
              </div>
          );
      }
      else { // otherwise populate each appointment with its user info
          for (let i = 0; i < filteredApps.length; i++) {
              for (let j = 0; j < users.length; j++) {
                  if (filteredApps[i].uid === users[j].uid) {
                      filteredApps[i].firstName = users[j].firstName
                      filteredApps[i].lastName = users[j].lastName
                      filteredApps[i].email = users[j].email
                      filteredApps[i].phoneNumber = users[j].phoneNumber
                  }
              }
          }
          return <div className = "grid" >{filteredApps.map(GenerateList)}</div> // then generate the appointment cards
      }
  }

  // render the today's appointments list and customer appointments list
  // note that the customer list requires its own function so that when a customer is selected
  // it doesn't rerender the today's appointment list
  // also note that they both use the same appointments table so changing its state will cause both rerender
  if (ready) {
      return (
          <>
          <br></br>
          <label className="TodayHeader">Today's Appointments</label>
          <br></br>
          <div>
              <GenerateTodaysModals/> 
          </div>
          <label className="AllAppHeader">All Customer Appointments</label>
          <div>
              <MakeCustomerApps setApps = {setApps} appointments = {appointments} users = {users}/>
          </div>
          </>
      );
  }
  else {
      return (
        <label>loading...</label>  
      );
  }

  function MakeCustomerApps(props) {
    const [selectedUser, setSelectedUser] = useState(-1);
    const handleChange = (event) => {
        setSelectedUser(event.target.value)
    }
    function GenerateCustomerModals() {
        let filteredUsers = props.users.filter(use => use.uid === Number(selectedUser)) // filter users array by selected user
        const GenerateList = filteredUsers.map((user, index) =>
            <MakeCards uid = {user.uid} aid = {null} setApps = {props.setApps} Apps = {props.appointments} role = {"admin"}
            firstName = {user.firstName} lastName = {user.lastName} email = {user.email}  phoneNumber = {user.phoneNumber}/>
        );
        return GenerateList
    }
    
    return (
        <>      
        <br></br>
        <Form>
             <Form.Group style = {{width: "360px", margin:"auto", fontSize:"22px"}} as={Row} onChange = {handleChange} className="mb-3" controlId="dateMenu">
                    <Form.Label column sm="3" className="createAccountLabels">Customer</Form.Label>
                    <Col sm="8" >
                        <Form.Select style = {{marginLeft:"20px",fontSize:"18px"}} aria-label="Default select example" className="mb-3" name="priority">
                            <option value = {-1}>Customer...</option>
                            {props.users.map((user) => {
                                return <option value ={user.uid}>
                                   {user.firstName+" "+user.lastName}
                                </option>;
                            })}
                        </Form.Select>
                    </Col>                           
                </Form.Group> 
        </Form>
        <div>
            <GenerateCustomerModals/>
        </div>
        </>
    )
}
  
}

export default MakeAdminPage;