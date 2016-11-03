import React from 'react'
import * as ReactRedux from 'react-redux';
import {addRound} from '../reducers';

class CategorieItemUI extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      let clickHandler = (evt) => {
         evt.preventDefault();
         this.props.addRound(this.props.item._id)
      }
      return  (
          <div>
             <span onClick={clickHandler}>
             {this.props.name}
             </span>
          </div>
      )
   }
}


function mapDispatchToProps(dispatch) {
   return {
      addRound: (id) => dispatch(addRound(id))
   }
}

function mapStateToProps(state) {
   return {
   }
}

export const CategorieItem = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(CategorieItemUI);
