import React from 'react';
import * as ReactRedux from 'react-redux';

class PasswordScreenUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <br/><br/>
                <h1>Password: {this.props.password}</h1>

            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        password: state.base.password
    }
}


function mapDispatchToProps(dispatch) {
    return {
    }
}



export const PasswordScreen =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(PasswordScreenUI);
