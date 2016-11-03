import React from 'react'
import * as ReactRedux from 'react-redux';
import {Logout} from './Logout';
import {GetAllQuestions} from '../reducers';
import {QuestionItem} from './QuestionItem'


class QuestionListUI extends React.Component {
   constructor(props) {
      super(props);
   }

   getItems(){
   this.props.doGetItems()
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
             <button id="showItems" onClick={this.getItems.bind(this)}>
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
      doGetItems: () => dispatch(GetAllQuestions()),
   }
}

function mapStateToProps(state) {
   return {
      items: state.questions.items
   }
}


function Item(props) {

}


export const QuestionList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionListUI);
