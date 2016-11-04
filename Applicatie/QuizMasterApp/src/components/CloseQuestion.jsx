import React from 'react'
import * as ReactRedux from 'react-redux';
import {closeQuestion} from '../reducers';


class CloseQuestionUI extends React.Component {

   closeQuestion() {
      this.props.docloseQuestion()
   }

   render() {
      return (<div>
             <h1>test</h1>
             {this.props.questionID}
             <button id="markAsSeen" onClick={this.closeQuestion.bind(this)}>
                close question
             </button>
          </div>
      );
   }
}


function mapDispatchToProps(dispatch) {
   return {
      docloseQuestion: () => dispatch(closeQuestion()),
      }
}


function mapStateToProps(state) {
   return {
      questionID: state.questions.questionID
   }
}

export const CloseQuestion = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CloseQuestionUI);
