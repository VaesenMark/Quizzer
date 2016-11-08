import React from 'react';
import * as ReactRedux from 'react-redux';

// Bootstrap
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'


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

    submitLogin(e) {
        e.preventDefault();
        this.props.submitLogin(this.props.password, this.props.teamname)
    }

    render() {
        let errorType = "";
        if(this.props.loginSuccess === false) {
            errorType = "alert-warning"
        }
        if(this.props.loginSuccess === true) {
            errorType = "alert-success"
        }

        return (
            <div>
                <h2>Register team</h2>

                <Form>
                    <FormGroup>
                        <ControlLabel>Quiz password</ControlLabel>
                        <FormControl
                            type="text"
                            className="maxInputWidth"
                            value={this.props.password}
                            onChange={this.updatePassword.bind(this)}
                        />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>Team name</ControlLabel>
                        <FormControl
                            type="text"
                            className="maxInputWidth"
                            value={this.props.teamname}
                            onChange={this.updateTeamname.bind(this)}
                        />
                    </FormGroup>

                    {this.props.loginSuccess === true ? '' : <button onClick={this.submitLogin.bind(this)}>Submit</button>}

                    <br/><br/>
                    <div className={`messageMaxWidth alert ${errorType}`}>
                        {this.props.loginMessage}
                    </div>
                </Form>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        password: state.login.password,
        teamname: state.login.teamname,
        loginMessage: state.login.loginMessage,
        loginSuccess: state.login.loginSuccess
    }
}


function mapDispatchToProps(dispatch) {
    return {
        updatePassword: (password) => dispatch(updatePasswordAction(password)),
        updateTeamname: (teamname) => dispatch(updateTeamnameAction(teamname)),
        submitLogin: (password, teamname) => dispatch(submitLoginAction(password, teamname))
    }
}



export const Login =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginUI);
