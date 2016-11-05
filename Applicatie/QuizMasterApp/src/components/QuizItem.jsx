import React from 'react'
import * as ReactRedux from 'react-redux';
import {checkTeams} from '../reducers';

class QuizItemUI extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      let clickHandler = (evt) => {
         console.log(this.props.item);
         evt.preventDefault();
         this.props.checkTeams(this.props.item)
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
      checkTeams: (item) => dispatch(checkTeams(item))
   }
}

function mapStateToProps(state) {
   return {
   }
}

export const QuizItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(QuizItemUI);
