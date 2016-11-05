import React from 'react'
import * as ReactRedux from 'react-redux';
import {getNextQuestion, getNextRound} from '../reducers';


class CheckAnswersUI extends React.Component {
   getAnswers(){
     // this.props.getAnswers(this.props.quizID, this.props.roundNumber, this.props.questionID)
   }
    nextRound(){
        this.props.getNextRound(this.props.quiz);
    }
   nextQuestion(){
      this.props.getNextQuestion(this.props.quiz._id, this.props.roundNumber);
   }
   render() {
       var nextRound = <button id="markAsSeen" onClick={this.nextQuestion.bind(this)}>
           Next Question
       </button>;
       if(this.props.questionNumber >= 12){
           nextRound = <div><button id="markAsSeen" onClick={this.nextRound.bind(this)}>
               Next Round
           </button></div>
       }
      return (<div>
             <h1>test</h1>
             quizid: {this.props.quizID}
            roundnun  mber:  {this.props.roundNumber}
             number:{this.props.questionNumber}
             <button id="markAsSeen" onClick={this.getAnswers.bind(this)}>
                Get Answers
             </button>

             {this.props.questionNumber}
              {nextRound}
          </div>
      );
   }
}


function mapDispatchToProps(dispatch) {
   return {
      //getAnswers: (quizID, roundNumber, questionID) => dispatch(getAnswersquizID(), roundNumber, questionID),
      getNextQuestion: (quizID, RoundNumber) => dispatch(getNextQuestion(quizID, RoundNumber)),
       getNextRound: (quiz) => dispatch(getNextRound(quiz)),
   }
}

function mapStateToProps(state) {
   return {
       quiz: state.headState.quizItem,
      roundNumber:  state.questions.roundNumber,
      questionNumber: state.questions.questionNumber
   }
}

export const CheckAnswers = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckAnswersUI);
