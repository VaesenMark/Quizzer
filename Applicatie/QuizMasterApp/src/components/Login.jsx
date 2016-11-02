import React from 'react'
import * as ReactRedux from 'react-redux';
import {loginAction} from '../reducers';


class LoginUi extends React.Component {
   constructor(props) {
      super(props);
   }
   render() {
      return (
          <div>Hallo
             <button id="markAsSeen" onClick={() => this.props.getLogin()}>
                Mark all items as “seen”
             </button>
          </div>

      );
   }
}





function mapDispatchToProps(dispatch) {
   return {
      getLogin: () => dispatch(loginAction()),
   }
}

function mapStateToProps(state) {
   return {
       selectedItem: 0
   }
}

export const Login = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LoginUi);
