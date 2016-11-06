import React from 'react'
import * as ReactRedux from 'react-redux';
import {QuestionItem} from './QuestionItem'


class QuestionListUI extends React.Component {
   constructor(props) {
      super(props);
   }


   render() {
      let theItems = [];

      if (this.props.items.length>=1) {
         theItems = this.props.items.map((itm, idx) =>
             <QuestionItem item={itm}
                   key = {itm._id}
                            question = {itm.question}
                           closeable = {false}
             />
         )
      }
      return (
          <div>
             {this.props.message}
             {theItems}
          </div>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return {
   }
}

function mapStateToProps(state) {
   return {
      items: state.QuestionsState.items,
      quiz: state.MainState.quizItem,
      message: state.QuestionsState.message
   }
}


export const QuestionList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionListUI);
