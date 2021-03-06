import React from 'react'
import * as ReactRedux from 'react-redux';
import {closeQuestion} from '../reducers';
import {PlayedQuestionItem} from './playedQuestionItems';


class CloseQuestionUI extends React.Component {

   closeQuestion() {
      this.props.docloseQuestion(this.props.quiz._id, this.props.roundNumber, this.props.questionNumber)
   }

   render() {
       let theItems = [];
       if (this.props.playedQuestions.length >= 1) {
           theItems = this.props.playedQuestions.map((itm, idx) =>
               <PlayedQuestionItem
                   key={itm._id}
                   answer={itm.answer}
                   judgeAble={false}
                   teamId={itm.teamID}
                   approved={itm.approved}
               />
           )
       }

       return (<div>
               <h1>Submitted answers</h1>
               {this.props.questionID}
               <div className="givenAnswers">
                   {theItems}
                   <div className="closeQuestion">
                       <button className="btn btn-primary" id="button" onClick={this.closeQuestion.bind(this)}>
                           close question
                       </button>
                   </div>
               </div>
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
       message: state.PlayedQuestionState.message,
       playedQuestions: state.PlayedQuestionState.answers
   }
}

export const CloseQuestion = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CloseQuestionUI);
