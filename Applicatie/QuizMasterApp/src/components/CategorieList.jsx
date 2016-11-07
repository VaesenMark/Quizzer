import React from 'react'
import * as ReactRedux from 'react-redux';
import {closeAndEndTheQuiz} from '../reducers';
import {CategorieItem} from './CategorieItem'

class CategorieListUI extends React.Component {
   constructor(props) {
      super(props);
   }
   closeTheQuiz(){
      this.props.closeAndEndTheQuiz(this.props.quiz._id, this.props.quizMasterID );
   }


   render() {
      let theItems = [];
      let closeQuiz = '';
      if(this.props.items == ''){
         closeQuiz = <button id="selectButton" onClick={this.closeTheQuiz.bind(this)}>Close quiz</button>
      }
      else if (this.props.items.length >= 1) {
         theItems = this.props.items.map((itm, idx) =>
             <CategorieItem item={itm}
                   key = {itm._id}
                            name = {itm.categoryName}
             />
         )
      }


      return (
          <div>
             {this.props.message}
             {theItems}
             {closeQuiz}
          </div>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return {
      closeAndEndTheQuiz: (quizID, quizMasterID) =>dispatch(closeAndEndTheQuiz(quizID, quizMasterID))
   }
}

function mapStateToProps(state) {
   return {
      quizMasterID: state.MainState.quizMasterID,
      items: state.RoundState.items,
      quiz: state.MainState.quizItem,
      message: state.RoundState.message
   }
}


export const CategorieList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorieListUI);
