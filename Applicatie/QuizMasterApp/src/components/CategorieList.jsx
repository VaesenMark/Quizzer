import React from 'react'
import * as ReactRedux from 'react-redux';
import {Logout} from './Logout';
import {GetAllCategories} from '../reducers';
import {CategorieItem} from './CategorieItem'


class CategorieListUI extends React.Component {
   constructor(props) {
      super(props);
   }

   getCattegoryItems(){
   this.props.doGetCattegoryItems(this.props.quiz._id)
   };



   render() {
      let theItems = [];

      if (this.props.items.length>1) {
         theItems = this.props.items.map((itm, idx) =>
             <CategorieItem item={itm}
                   key = {itm._id}
                            name = {itm.categoryName}
             />
         )
      }

      return (
          <div>
             <button id="showItems" onClick={this.getCattegoryItems.bind(this)}>
                get Categories

             </button>
             {theItems}
             <Logout/>
          </div>
      );
   }
}

function mapDispatchToProps(dispatch) {
   return {
      doGetCattegoryItems: (quizID) => dispatch(GetAllCategories(quizID)),
   }
}

function mapStateToProps(state) {
   return {

      items: state.categories.items,
      quiz: state.headState.quizItem
   }
}


function Item(props) {

}


export const CategorieList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorieListUI);
