import React from 'react'
import * as ReactRedux from 'react-redux';
import {addRound} from '../reducers';

class CategorieItemUI extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      let clickHandler = (evt) => {
         evt.preventDefault();
         console.log(this.props.quiz._id);
         this.props.addRound(this.props.quiz._id, this.props.item)
      }
      return  (
          <div className="CategoryItem">
             {this.props.message}

             <button onClick={clickHandler}>
             select
             </button>
             {this.props.name}
          </div>
      )
   }
}


function mapDispatchToProps(dispatch) {
   return {
      addRound: (quizID, categoryID) => dispatch(addRound(quizID, categoryID))
   }
}

function mapStateToProps(state) {
   return {
      quiz: state.MainState.quizItem,
      message: state.QuizItemsState.message
   }
}

export const CategorieItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorieItemUI);
