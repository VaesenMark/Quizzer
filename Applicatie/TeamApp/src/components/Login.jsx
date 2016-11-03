import React from 'react';
import * as ReactRedux from 'react-redux';

import {
    updatePasswordAction, updateTeamnameAction, submitLoginAction
} from '../reducers';

//============================================================================
//  The React component that renders the UI for the PreferencesDialog
//----------------------------------------------------------------------------

class LoginUI extends React.Component {
    constructor(props) {
        super(props)
    }

    updatePassword(evt) {
        this.props.updatePassword(evt.target.value)
    }

    updateTeamname(evt) {
        this.props.updateTeamname(evt.target.value)
    }

    submitLogin(evt) {
        this.props.submitLogin(evt.target.value)
    }

    render() {
        return (
            <div>
                Password:
                <input type="text" id="password" value={this.props.password} onChange={this.updatePassword.bind(this)} />
                TeamName:
                <input type="text" id="teamname" value={this.props.teamname} onChange={this.updateTeamname.bind(this)} />
                <br/>
                {this.props.loginMessage}
                <br/>
                <button onClick={this.submitLogin.bind(this)}>OK</button>
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
        submitLogin: () => dispatch(submitLoginAction())
    }
}




export const Login =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginUI);
