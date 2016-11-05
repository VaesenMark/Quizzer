import React from 'react'
import * as ReactRedux from 'react-redux';
import {getNextQuestion, getNextRound} from '../reducers';
import{PlayedQuestionItem} from './playedQuestionItems'

class CheckAnswersUI extends React.Component {
    nextRound(){
        this.props.getNextRound(this.props.quiz);
    }
   nextQuestion(){
      this.props.getNextQuestion(this.props.quiz._id, this.props.roundNumber);
   }



   render() {
       let theItems = [];
       if (this.props.answers.length > 1) {

       }
       theItems=<PlayedQuestionItem item={null}
                               key = {1}
                               answer = {"Goed"}
                                    teamID = {1}
       />
       var nextRound = <button id="markAsSeen" onClick={this.nextQuestion.bind(this)}>
           Next Question
       </button>;
       if(this.props.questionNumber >= 12){
           nextRound = <button id="markAsSeen" onClick={this.nextRound.bind(this)}>
               Next Round
           </button>
       }
      return (<div>
             quizid: {this.props.quizID}
            roundnun  mber:  {this.props.roundNumber}
             number:{this.props.questionNumber}
              {nextRound}
              {theItems}
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
      questionNumber: state.questions.questionNumber,
       answers: state.playedQuestion.answers,
   }
}

export const CheckAnswers = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckAnswersUI);
