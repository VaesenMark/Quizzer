import React from 'react'
import * as ReactRedux from 'react-redux';
import {approveTeam} from '../reducers'

class CheckTeamItemsUI extends React.Component {
   constructor(props) {
      super(props);
   }

    approveTeam(){
        this.props.approveTeam1(this.props.quiz._id, this.props.item._id);

    }

   render() {

       let button = '';
       console.log(this.props.approved);
       if(!this.props.approved){
           button = <button id="markAsSeen" onClick={this.approveTeam.bind(this)}>approve</button>
       }
      return  (
<h1>{this.props.name} -  {button}</h1>
      )
   }
}


function mapDispatchToProps(dispatch) {
   return {
      approveTeam1: (quizID,teamID) => dispatch(approveTeam(quizID, teamID))
   }
}

function mapStateToProps(state) {
   return {
      quiz: state.MainState.quizItem
   }
}

export const CheckTeamsItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckTeamItemsUI);
