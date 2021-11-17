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
                        <h3 className="text">First Name: <span className="apiText">{this.props.userData[1]}</span></h3>
                        <h3 className="text">Last Name: <span className="apiText">{this.props.userData[2]}</span></h3>
                        <h3 className="text">Email: <span className="apiText">{this.props.userData[0]}</span></h3>
                        <h3 className="text">Phone Number: <span className="apiText">{this.props.userData[4]}</span></h3>                                
                    </div>							
                </div>
            </>
        )
    }
}

export default CustomerInfo;