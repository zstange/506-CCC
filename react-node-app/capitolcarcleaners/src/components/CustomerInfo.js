import React from 'react';
import "../css/CustomerHomepage.css"

class CustomerInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    
    render() {
        return (
            <>          
                <div className="border p-3">
                    <div className="sectionAcctBody">
                        <h3 className="text">First Name: <span className="apiText">{this.props.userData.firstName}</span></h3>
                        <h3 className="text">Last Name: <span className="apiText">{this.props.userData.lastName}</span></h3>
                        <h3 className="text">Email: <span className="apiText">{this.props.userData.email}</span></h3>
                        <h3 className="text">Phone Number: <span className="apiText">{this.props.userData.phoneNumber}</span></h3>                                
                    </div>							
                </div>
            </>
        )
    }
}

export default CustomerInfo;