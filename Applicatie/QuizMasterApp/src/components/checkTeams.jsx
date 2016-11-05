import React from 'react'
import * as ReactRedux from 'react-redux';
import {startQuiz} from '../reducers';


class CheckTeamsUI extends React.Component {
    startQuiz(){
        this.props.startQuiz(this.props.quiz);
    }

   render() {
      return (<div>
             <h1>test</h1>
              <button id="markAsSeen" onClick={this.startQuiz.bind(this)}>
                  Start quiz
              </button>
          </div>

      );
   }
}


function mapDispatchToProps(dispatch) {
   return {
       startQuiz: (quiz) => dispatch(startQuiz(quiz)),
   }
}

function mapStateToProps(state) {
   return {
       quiz: state.headState.quizItem
   }
}

export const CheckTeams = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckTeamsUI);
