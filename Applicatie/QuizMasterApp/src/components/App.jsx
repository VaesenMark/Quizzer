import React from 'react'
import * as ReactRedux from 'react-redux';
import {Login} from './Login';
import {QuizList} from './QuizList';
import {CategorieList} from './CategorieList';
import {QuestionList} from './QuestionList';
import {CheckAnswers} from './CheckAnswers';
import {CloseQuestion} from './CloseQuestion';
import {CheckTeamList} from './checkTeamsList';
import {Logout} from './Logout';

class AppUI extends React.Component {
   constructor(props) {
      super(props);
   }
   render() {
      var content = "";
      if(this.props.currentPage == 1){
         content = <div><Login/></div>
      }
      else if(this.props.currentPage == 2){
         content = <div><QuizList/><Logout/></div>

      }
      else if(this.props.currentPage == 3){
         content = <div><CheckTeamList/><Logout/></div>

      }
      else if(this.props.currentPage == 4){
         content = <div><CategorieList/><Logout/></div>

      }
      else if(this.props.currentPage == 5){
         content = <div><QuestionList/></div>

      }
      else if(this.props.currentPage == 6){
         content = <div><CloseQuestion/></div>

      }
      else if(this.props.currentPage == 7){
         content = <div><CheckAnswers/><Logout/></div>

      }

      return (
          content
      );
   }
}




function mapDispatchToProps(dispatch) {
   return {
   }
}


function mapStateToProps(state) {
   return {
      currentPage: state.MainState.currentPage
   }
}

export const App = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AppUI);
