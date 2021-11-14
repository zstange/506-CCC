import React from 'react';
import "../css/CustomerHomepage.css"

class CustomerInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // firstName: "",
            // lastName: "",
            // email: "",
            // phoneNum: "",
        }
    }

    getFirstName() {
        // fetches username from DB
        console.log("Props userData values: "+ this.props.userData)
        //var firstName = "User " + this.props.userId.value;
        //return firstName
    }

    render() {
        return (
            <>          
                <div className="border p-3">
                    <div className="sectionAcctBody">
                        <h3>First Name: {this.getFirstName()}</h3>
                        <h3>Last Name: {this.props.userData}</h3>
                        <h3>Email: {this.props.userData}</h3>
                        <h3>Phone Number: {this.props.userData}</h3>                                
                    </div>							
                </div>
            </>
        )
    }
}

export default CustomerInfo;