import React from 'react'
import * as ReactRedux from 'react-redux';
import {AddQuiz} from '../reducers';
import {QuizItem} from './QuizItem'


class ChoseQuizUI extends React.Component {
   constructor(props) {
      super(props);
   }

    addQuiz(){
        this.props.doAddQuiz(this.props.id)
    };


   render() {
      let theItems = [];
      if (this.props.items.length >= 1) {
         theItems = this.props.items.map((itm, idx) =>
             <QuizItem item={itm}
                   key = {itm._id}
                   password={itm.password}
                   status={itm.status}
             />
         )
      }
      return (
          <div>
              {this.props.message}
              <div id="QuizList" >
              {theItems}
              </div>
              <button id="addQuiz" onClick={this.addQuiz.bind(this)}>
                  addQuiz

              </button>
          </div>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return {
       doAddQuiz: (id) => dispatch(AddQuiz(id))
   }
}

function mapStateToProps(state) {
   return {
      items: state.QuizItemsState.items,
       id: state.MainState.quizMasterID,
       message: state.QuizItemsState.message
   }
}



export const QuizList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ChoseQuizUI);
