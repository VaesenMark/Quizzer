import React from 'react'
import * as ReactRedux from 'react-redux';
import {getNextQuestion, getNextRound, closeAndEndTheQuiz} from '../reducers';
import{PlayedQuestionItem} from './playedQuestionItems'

class CheckAnswersUI extends React.Component {
    nextRound(){
        this.props.getNextRound(this.props.quiz);
    }
   nextQuestion(){
      this.props.getNextQuestion(this.props.quiz._id, this.props.roundNumber);
   }

    closeTheQuiz(){
        this.props.closeAndEndTheQuiz(this.props.quiz._id, this.props.quizMasterID );
    }


   render() {
       let theItems = [];
       if (this.props.playedQuestions.length >= 1) {
           theItems = this.props.playedQuestions.map((itm, idx) =>
               <PlayedQuestionItem item={itm}
                                   key={itm._id}
                                   answer={itm.answer}
                                   judgeAble={true}
                                   teamId={itm.teamID}
               />
           )
       }
       var closeQuiz = '';
       var nextQuestion = <button className="btn btn-primary" id="button" onClick={this.nextQuestion.bind(this)}>
           Next Question
       </button>;
       if (this.props.questionNumber >= 12) {
           closeQuiz =
               <button className="btn btn-primary" id="selectButton" onClick={this.closeTheQuiz.bind(this)}>Close
                   quiz</button>
           if (this.props.items.length > 1) {
               nextQuestion = <button className="btn btn-primary" id="button" onClick={this.nextRound.bind(this)}>
                   Next Round
               </button>
           }
       }
       return (<div>
               <h1>Judge answers
                   quizid: {this.props.quiz._id} -
                   ronde: {this.props.roundNumber} -
                   vraag:{this.props.questionNumber}/12
               </h1>
               <div className="Question">
                   <h1>question: {this.props.question.question}</h1>
                   <h2 id="givenAnswer">answer: {this.props.question.answer}</h2>
               </div>
               {this.props.message}

               <br/>
               <div className="givenAnswers">
                   {theItems}
                   <div className="nextButtons">
                       {nextQuestion}
                       {closeQuiz}
                   </div>
               </div>
           </div>
       );
   }
}


function mapDispatchToProps(dispatch) {
   return {
      getNextQuestion: (quizID, RoundNumber) => dispatch(getNextQuestion(quizID, RoundNumber)),
       getNextRound: (quiz) => dispatch(getNextRound(quiz)),
       closeAndEndTheQuiz: (quizID, quizMasterID) =>dispatch(closeAndEndTheQuiz(quizID, quizMasterID))

   }
}

function mapStateToProps(state) {
   return {
       quizMasterID: state.MainState.quizMasterID,
       quiz: state.MainState.quizItem,
       roundNumber:  state.QuestionsState.roundNumber,
       questionNumber: state.QuestionsState.questionNumber,
       message: state.PlayedQuestionState.message,
       playedQuestions: state.PlayedQuestionState.answers,
       items: state.RoundState.items,
       question: state.QuestionsState.recentQuestion
   }
}

export const CheckAnswers = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CheckAnswersUI);
