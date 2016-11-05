import React from 'react'
import * as ReactRedux from 'react-redux';
import {QuestionItem} from './QuestionItem'


class QuestionListUI extends React.Component {
   constructor(props) {
      super(props);
   }


   render() {
      let theItems = [];

      if (this.props.items.length>1) {
         theItems = this.props.items.map((itm, idx) =>
             <QuestionItem item={itm}
                   key = {itm._id}
                            question = {itm.question}
             />
         )
      }
      return (
          <div>
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
      items: state.questions.items,
      quiz: state.headState.quizItem,
   }
}


function Item(props) {

}


export const QuestionList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionListUI);
