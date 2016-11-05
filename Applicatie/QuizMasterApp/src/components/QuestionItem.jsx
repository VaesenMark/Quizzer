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

         this.props.addQuestionToRound(this.props.quiz._id, (this.props.roundNumber), this.props.item._id)
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
      addQuestionToRound: (quizId, roundNumber, questionID) => dispatch(addQuestion(quizId, roundNumber, questionID))
   }
}

function mapStateToProps(state) {
   return {
      quiz: state.headState.quizItem,
      roundNumber: state.round.roundNumber
   }
}

export const QuestionItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionItemUI);
