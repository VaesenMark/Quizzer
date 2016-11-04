import React from 'react'
import * as ReactRedux from 'react-redux';
import {startQuiz} from '../reducers';

class QuizItemUI extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      let clickHandler = (evt) => {
         evt.preventDefault();
         this.props.startQuiz(this.props.item)
      }
      return  (
          <div>
             <span onClick={clickHandler}>
             {this.props.status}  {this.props.password}
             </span>
          </div>
      )
   }
}


function mapDispatchToProps(dispatch) {
   return {
      startQuiz: (item) => dispatch(startQuiz(item))
   }
}

function mapStateToProps(state) {
   return {
   }
}

export const QuizItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizItemUI);
