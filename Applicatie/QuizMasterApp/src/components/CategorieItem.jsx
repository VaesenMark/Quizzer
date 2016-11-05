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
          <div>
             <span onClick={clickHandler}>
             {this.props.name}
             </span>
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
      quiz: state.MainState.quizItem
   }
}

export const CategorieItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorieItemUI);
