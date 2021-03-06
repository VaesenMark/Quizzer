import React from 'react'
import * as ReactRedux from 'react-redux';
import {goToCheckTeams,closeQuiz} from '../reducers';

class QuizItemUI extends React.Component {
   constructor(props) {
      super(props);
   }

   closeTheQuiz(){
      this.props.closeTheQuiz(this.props.item._id, this.props.quizMasterID );
   }


   render() {
      let clickHandler = (evt) => {
         evt.preventDefault();
         this.props.goToCheckTeams(this.props.item)
      };
      var closeButton = '';
      if(this.props.item.status ==3){
         closeButton = <button id="closeButton"  className="btn btn-primary" onClick={this.closeTheQuiz.bind(this)}>close </button>
      }

      return  (

          <div className="QuizItem">
             {this.props.message}
             <button id="selectButton"  className="btn btn-primary" onClick={clickHandler}>Select </button>
                  {this.props.password}
             {closeButton}
          </div>
      )
   }
}


function mapDispatchToProps(dispatch) {
   return {
      goToCheckTeams: (item) => dispatch(goToCheckTeams(item)),
      closeTheQuiz: (quizID, quizMasterID) =>dispatch(closeQuiz(quizID, quizMasterID))
   }
}

function mapStateToProps(state) {
   return {
      message: state.QuizItemsState.message,
      quizMasterID: state.MainState.quizMasterID,
      quiz: state.MainState.quizItem
   }
}

export const QuizItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizItemUI);
