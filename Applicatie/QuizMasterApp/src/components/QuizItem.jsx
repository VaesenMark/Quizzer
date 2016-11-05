import React from 'react'
import * as ReactRedux from 'react-redux';
import {goToCheckTeams} from '../reducers';

class QuizItemUI extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      let clickHandler = (evt) => {
         console.log(this.props.item);
         evt.preventDefault();
         this.props.goToCheckTeams(this.props.item)
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
      goToCheckTeams: (item) => dispatch(goToCheckTeams(item))
   }
}

function mapStateToProps(state) {
   return {
   }
}

export const QuizItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizItemUI);
