import React from 'react'
import * as ReactRedux from 'react-redux';
import {Logout} from './Logout';
import {GetAllQuizen} from '../reducers';
import {QuizItem} from './QuizItem'


class ChoseQuizUI extends React.Component {
   constructor(props) {
      super(props);
   }

   getItems(){
   this.props.doGetItems()
   };



   render() {
      let theItems = [];
      if (this.props.items.length>1) {
         theItems = this.props.items.map((itm, idx) =>
             <QuizItem item={itm}
                   key = {itm._id}
                   password={itm.password}
                   status={itm.status}
             />
         )
      }
console.log(theItems);
      return (
          <div>
             <button id="showItems" onClick={this.getItems.bind(this)}>
                get Quizen

             </button>
             {theItems}
             <Logout/>
          </div>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return {
      doGetItems: () => dispatch(GetAllQuizen()),
   }
}

function mapStateToProps(state) {
   return {
      items: state.quizItems.items
   }
}



export const QuizList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(ChoseQuizUI);
