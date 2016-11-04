import React from 'react'
import * as ReactRedux from 'react-redux';
import {logout} from '../reducers';


class LogoutUI extends React.Component {
   constructor(props) {
      super(props);
   }

   doLogout(){
      this.props.getLogOut();
   }

   render() {
      return (<div>
             <button id="markAsSeen" onClick={this.doLogout.bind(this)}>
                Logout
             </button>
          </div>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return {
      getLogOut: () => dispatch(logout()),
   }
}

function mapStateToProps(state) {
   return {
      id: state.headState.quizMasterID
   }
}

export const Logout = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(LogoutUI);
