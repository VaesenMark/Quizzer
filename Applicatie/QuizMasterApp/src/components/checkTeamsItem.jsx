import React from 'react'
import * as ReactRedux from 'react-redux';
import {approveTeam} from '../reducers'

class CheckTeamItemsUI extends React.Component {
   constructor(props) {
      super(props);
   }

    approveTeam(){
        this.props.approveTeam(this.props.quiz._id, this.props.item._id, true);
    }
    deniedTeam(){
        this.props.approveTeam(this.props.quiz._id, this.props.item._id, false);

    }

   render() {

       let approveButton = '';
       let deniedButton = '';
       if(!this.props.approved){
           approveButton = <button className="btn btn-primary" id="checkTeamItemButton" onClick={this.approveTeam.bind(this)}>approve</button>
           deniedButton = <button className="btn btn-primary" id="checkTeamItemButton" onClick={this.approveTeam.bind(this)}>denied</button>
       }

      return  (
          <div id="checkTeamItem">{this.props.message}
          <h2>{this.props.name} -  </h2>{approveButton}{deniedButton}
          </div>
      )
   }
}


function mapDispatchToProps(dispatch) {
   return {
      approveTeam: (quizID,teamID, approved) => dispatch(approveTeam(quizID, teamID, approved))
   }
}

function mapStateToProps(state) {
   return {
      quiz: state.MainState.quizItem,

   }
}

export const CheckTeamsItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckTeamItemsUI);
