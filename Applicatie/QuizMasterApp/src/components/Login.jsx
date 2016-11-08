import React from 'react'
import * as ReactRedux from 'react-redux';
import {loginAction, editPassword, editUsername} from '../reducers';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'

class LoginUi extends React.Component {
   constructor(props) {
      super(props);
   }
   usernameChange(evt) {
      this.props.doEditUsername(evt.target.value)
   }

   passwordChange(evt){
      this.props.doEditPassword(evt.target.value)
   }

   doLogin(e){
      e.preventDefault();
      this.props.getLogin(this.props.username, this.props.password);
   }



   render() {
      return (
          <div id="Login">
             <Form>
             <FormGroup>
                <ControlLabel>Username</ControlLabel>
                <FormControl
                    type="text"
                    className="maxInputWidth"
                    value={this.props.username}
                    onChange={this.usernameChange.bind(this)}
                />
             </FormGroup>
             <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl
                    type="text"
                    className="maxInputWidth"
                    value={this.props.password}
                    onChange={this.passwordChange.bind(this)}
                />
             </FormGroup>
                <button className="btn btn-primary" id="inglogButton" onClick={this.doLogin.bind(this)}>
                   Login
                </button>
                </Form>
             </div>



      );
   }
}


function mapDispatchToProps(dispatch) {
   return {
      getLogin: (username, password) => dispatch(loginAction(username,password)),
      doEditUsername: (userName) => dispatch(editUsername(userName)),
      doEditPassword: (password) => dispatch(editPassword(password)),
   }
}

function mapStateToProps(state) {
   return {
      username: state.LoginState.username,
      password: state.LoginState.password,
      message: state.LoginState.message
   }
}

export const Login = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginUi);
