import React from 'react'
import * as ReactRedux from 'react-redux';
import {loginAction, editPassword, editUsername} from '../reducers';


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

   doLogin(){
      this.props.getLogin(this.props.username, this.props.password);
   }



   render() {
      return (<div>
             <label htmlFor="Username">
                Username <input id="listSizeField" value={this.props.username} onChange={this.usernameChange.bind(this)}/>
             </label><br/>
             <label htmlFor="Password">
                Password <input id="quizMasterPassword" value={this.props.password} onChange={this.passwordChange.bind(this)}/>
             </label>
             <button id="markAsSeen" onClick={this.doLogin.bind(this)}>
                Login
             </button>
              {this.props.error}
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
      username: state.quizMaster.username,
      password: state.quizMaster.password,
      id: state.quizMaster.id,
          error: state.quizMaster.error
   }
}

export const Login = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginUi);
