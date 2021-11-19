import React, {useEffect,useState} from "react"; 
import { useSelector } from "react-redux";
import Axios from 'axios';
import '../css/CustomerHistory.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MakeHistoryCards from "./MakeHistoryCards";
import { Card, ListGroup, ListGroupItem, Form, Button, Row, Col, Modal} from "react-bootstrap";

function MakeAdminHistory() {
    const token = useSelector((state) => state.token.value);

    const [appointments, setApps] = useState([])
    const [users,setUsers] = useState([])
    const [ready,setReady] = useState(false)

    useEffect(() => {
        // useEffect lets us fetch tables once the page is finished loading
        async function fetchTables() {
            await Axios.get("http://localhost:3001/getAppointmentsAdmin", {
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
                    setUsers(Array(response.data.data)[0])
                }
            });
        }
        fetchTables()
        setReady(true)
    }, []);

    function MakeCustomerApps(props) {
        const [selectedUser, setSelectedUser] = useState(-1);
    
        const handleChange = (event) => {
            setSelectedUser(event.target.value)
        }
    
        function GenerateCustomerModals() {
            let filteredUsers = props.users.filter(use => use.uid === Number(selectedUser)) // filter users array by selected user
            const GenerateList = filteredUsers.map((user, index) =>
                <MakeHistoryCards uid = {user.uid} aid = {null} setApps = {props.setApps} Apps = {props.appointments} role = {"admin"}
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

    // render the today's appointments list and customer appointments list
    // note that the customer list requires its own function so that when a customer is selected
    // it doesn't rerender the today's appointment list
    // also note that they both use the same appointments table so changing its state will cause both rerender
    if (ready) {
        return (
            <>
            <br></br>
            <label className="AllAppHeader">Service History</label>
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
}

export default MakeAdminHistory