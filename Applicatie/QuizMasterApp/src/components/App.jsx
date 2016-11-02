import React from 'react'
import * as ReactRedux from 'react-redux';
import {Login} from './Login';
import {Logout} from './Logout';


class AppUI extends React.Component {
   constructor(props) {
      super(props);
   }
   render() {
      var content = "";
      console.log(this.props.id>0, this.props.id);
      if(this.props.id == 0){
         content = <div><Login/></div>
      }
      else{
         content = <div><Logout/></div>
      }
      return (
          content
      );
   }
}




function mapDispatchToProps(dispatch) {
   return {
   }
}


function mapStateToProps(state) {
   return {
       id: state.quizMaster.id
   }
}

export const App = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AppUI);
