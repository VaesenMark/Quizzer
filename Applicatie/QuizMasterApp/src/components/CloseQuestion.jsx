import React from 'react'
import * as ReactRedux from 'react-redux';
import {closeQuestion} from '../reducers';


class CloseQuestionUI extends React.Component {

   closeQuestion() {
      this.props.docloseQuestion(this.props.quiz._id, this.props.roundNumber, this.props.questionNumber)
   }

   render() {
      return (<div>
             <h1>test</h1>
             {this.props.questionID}
             <button id="markAsSeen" onClick={this.closeQuestion.bind(this)}>
                close question
             </button>
          </div>
      );
   }
}


function mapDispatchToProps(dispatch) {
   return {
      docloseQuestion: (quizID, roundID, roundNumber) => dispatch(closeQuestion(quizID, roundID, roundNumber)),
      }
}


function mapStateToProps(state) {
   return {
       quiz: state.MainState.quizItem,
       roundNumber:  state.QuestionsState.roundNumber,
       questionNumber: state.QuestionsState.questionNumber,
   }
}

export const CloseQuestion = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CloseQuestionUI);
