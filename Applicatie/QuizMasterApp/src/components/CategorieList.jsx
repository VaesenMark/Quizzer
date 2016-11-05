import React from 'react'
import * as ReactRedux from 'react-redux';
import {GetAllCategories} from '../reducers';
import {CategorieItem} from './CategorieItem'


class CategorieListUI extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      console.log(this.props.quiz);
      let theItems = [];

      if (this.props.items.length >= 1) {
         theItems = this.props.items.map((itm, idx) =>
             <CategorieItem item={itm}
                   key = {itm._id}
                            name = {itm.categoryName}
             />
         )
      }

      return (
          <div>
             {this.props.quiz._id}
             {theItems}
          </div>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return {
   }
}

function mapStateToProps(state) {
   return {

      items: state.round.items,
      quiz: state.headState.quizItem
   }
}


function Item(props) {

}


export const CategorieList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorieListUI);
