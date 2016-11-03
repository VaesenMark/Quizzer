import React from 'react'
import * as ReactRedux from 'react-redux';
import {Login} from './Login';
import {QuizList} from './QuizList';
import {CategorieList} from './CategorieList';
import {QuestionList} from './QuestionList';


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
         content = <div><QuizList/></div>

      }
      else if(this.props.currentPage == 3){
         content = <div><CategorieList/></div>

      }
      else if(this.props.currentPage == 4){
         content = <div><QuestionList/></div>

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
      currentPage: state.headState.currentPage
   }
}

export const App = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(AppUI);
