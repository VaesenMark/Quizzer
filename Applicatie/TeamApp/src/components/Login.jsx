import React from 'react';
import * as ReactRedux from 'react-redux';

import {
    updatePasswordAction, updateTeamnameAction, submitLoginAction, tempAcceptApplianceAction
} from '../reducers';


class LoginUI extends React.Component {
    constructor(props) {
        super(props);
    }

    updatePassword(evt) {
        this.props.updatePassword(evt.target.value)
    }

    updateTeamname(evt) {
        this.props.updateTeamname(evt.target.value)
    }

    submitLogin() {
        this.props.submitLogin(this.props.password, this.props.teamname)
    }

    tempAcceptAppliance() {
        this.props.tempAcceptAppliance()
    }

    render() {
        return (
            <div>
                <h2>Login</h2>
                Quiz password:
                <input type="text" id="password" value={this.props.password} onChange={this.updatePassword.bind(this)} />
                <br/>
                TeamName:
                <input type="text" id="teamname" value={this.props.teamname} onChange={this.updateTeamname.bind(this)} />
                <br/>
                {this.props.loginMessage}
                <br/>
                <button onClick={this.submitLogin.bind(this)}>OK</button>
                <button onClick={this.tempAcceptAppliance.bind(this)}>Next screen (temp)</button>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        password: state.login.password,
        teamname: state.login.teamname,
        loginMessage: state.login.loginMessage
    }
}


function mapDispatchToProps(dispatch) {
    return {
        updatePassword: (password) => dispatch(updatePasswordAction(password)),
        updateTeamname: (teamname) => dispatch(updateTeamnameAction(teamname)),
        submitLogin: (password, teamname) => dispatch(submitLoginAction(password, teamname)),
        tempAcceptAppliance: () => dispatch(tempAcceptApplianceAction())
    }
}



export const Login =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginUI);
