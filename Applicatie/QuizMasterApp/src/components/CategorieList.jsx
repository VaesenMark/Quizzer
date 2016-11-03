import React from 'react'
import * as ReactRedux from 'react-redux';
import {Logout} from './Logout';
import {GetAllCategories} from '../reducers';
import {CategorieItem} from './CategorieItem'


class CategorieListUI extends React.Component {
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
             <CategorieItem item={itm}
                   key = {itm._id}
                            name = {itm.categoryName}
             />
         )
      }

      return (
          <div>
             <button id="showItems" onClick={this.getItems.bind(this)}>
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
      doGetItems: () => dispatch(GetAllCategories()),
   }
}

function mapStateToProps(state) {
   return {
      items: state.categories.items
   }
}


function Item(props) {

}


export const CategorieList = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorieListUI);
