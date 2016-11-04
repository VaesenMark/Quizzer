import React from 'react'
import * as ReactRedux from 'react-redux';
import {addQuestion} from '../reducers';

class QuestionItemUI extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      let clickHandler = (evt) => {
         evt.preventDefault();
         this.props.addQuestionToRound(this.props.quiz._id, (this.props.quiz.rounds.length+ 1), this.props.item.question)
      };
      return  (
          <div>
             <span onClick={clickHandler}>
             {this.props.question}
             </span>
          </div>
      )
   }
}


function mapDispatchToProps(dispatch) {
   return {
      addQuestionToRound: (quizId, roundNumber, question) => dispatch(addQuestion(quizId, roundNumber, question))
   }
}

function mapStateToProps(state) {
   return {
      quiz: state.headState.quizItem,
   }
}

export const QuestionItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionItemUI);
