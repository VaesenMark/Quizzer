import React from 'react'
import * as ReactRedux from 'react-redux';
import {Logout} from './Logout';
import {GetAllQuestions} from '../reducers';
import {QuestionItem} from './QuestionItem'


class QuestionListUI extends React.Component {
   constructor(props) {
      super(props);
   }

   getQuestionItems(){
       this.props.doGetItems(this.props.quiz._id, (this.props.quiz.rounds.length+ 1));
   };



   render() {
      let theItems = [];

      if (this.props.items.length>1) {
         theItems = this.props.items.map((itm, idx) =>
             <QuestionItem item={itm}
                   key = {itm.question}
                            question = {itm.question}
             />
         )
      }
      return (
          <div>
             <button id="showItems" onClick={this.getQuestionItems.bind(this)}>
                get Questions

             </button>
             {theItems}
             <Logout/>
          </div>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return {
      doGetItems: (quizId, roundNumber) => dispatch(GetAllQuestions(quizId, roundNumber)),
   }
}

function mapStateToProps(state) {
   return {
      items: state.questions.items,
      quiz: state.headState.quizItem,
   }
}


function Item(props) {

}


export const QuestionList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionListUI);
