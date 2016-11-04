import React from 'react'
import * as ReactRedux from 'react-redux';
import {getNextQuestion} from '../reducers';


class CheckAnswersUI extends React.Component {
   getAnswers(){
     // this.props.getAnswers(this.props.quizID, this.props.roundNumber, this.props.questionID)
   }

   nextQuestion(){
      this.props.getNextQuestion(this.props.quizID, this.props.roundNumber);
   }
   render() {
      console.log(this.props);

      return (<div>
             <h1>test</h1>
             quizid: {this.props.quizID}
            pundnumber:  {this.props.roundNumber}
             number:{this.props.questionNumber}
             <button id="markAsSeen" onClick={this.getAnswers.bind(this)}>
                Get Answers
             </button>
             <button id="markAsSeen" onClick={this.nextQuestion.bind(this)}>
                Next Question
             </button>
             {this.props.questionNumber}

          </div>
      );
   }
}


function mapDispatchToProps(dispatch) {
   return {
      //getAnswers: (quizID, roundNumber, questionID) => dispatch(getAnswersquizID(), roundNumber, questionID),
      getNextQuestion: (quizID, RoundNumber) => dispatch(getNextQuestion(quizID, RoundNumber)),
   }
}

function mapStateToProps(state) {
   return {
      quizID: state.questions.quizID,
      roundNumber:  state.questions.roundNumber,
      questionNumber: state.questions.questionNumber
   }
}

export const CheckAnswers = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckAnswersUI);
