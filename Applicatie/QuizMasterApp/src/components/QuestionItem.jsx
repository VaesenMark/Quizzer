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
         //this.props.addQuestion(this.props.item._id)
      }
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
      //addQuestion: (id) => dispatch(addQuestion(id))
   }
}

function mapStateToProps(state) {
   return {
   }
}

export const QuestionItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuestionItemUI);
