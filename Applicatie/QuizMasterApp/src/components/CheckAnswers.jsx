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
       console.log('render');
       console.log(this.props.playedQuestions);
       if (this.props.playedQuestions.length>=1) {
           theItems = this.props.playedQuestions.map((itm, idx) =>
               <PlayedQuestionItem item={itm}
                                   key = {itm._id}
                                   answer = {itm.answer}
                                   judgeAble = {true}
                                   teamId = {itm.teamID}
               />
           )
       }

       var nextRound = <button id="markAsSeen" onClick={this.nextQuestion.bind(this)}>
           Next Question
       </button>;
       if(this.props.questionNumber >= 12){
           nextRound = <button id="markAsSeen" onClick={this.nextRound.bind(this)}>
               Next Round
           </button>
       }
      return (<div>
              <h1>Judge answers</h1>
              {this.props.message}
             quizid: {this.props.quizID}
            roundnunmber:  {this.props.roundNumber}
             number:{this.props.questionNumber}

              {theItems}
              {nextRound}
          </div>
      );
   }
}


function mapDispatchToProps(dispatch) {
   return {
      getNextQuestion: (quizID, RoundNumber) => dispatch(getNextQuestion(quizID, RoundNumber)),
       getNextRound: (quiz) => dispatch(getNextRound(quiz)),

   }
}

function mapStateToProps(state) {
   return {
       quiz: state.MainState.quizItem,
      roundNumber:  state.QuestionsState.roundNumber,
      questionNumber: state.QuestionsState.questionNumber,
       message: state.PlayedQuestionState.message,
       playedQuestions: state.PlayedQuestionState.answers
   }
}

export const CheckAnswers = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckAnswersUI);
