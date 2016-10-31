import React from 'react'
import * as ReactRedux from 'react-redux';


class AppUI extends React.Component {
   constructor(props) {
      super(props);
   }
   render() {
      return (
          <div>Hallo</div>
      );
   }
}







function mapStateToProps(state) {
   return {
       selectedItem: 0
   }
}

export const App = ReactRedux.connect(mapStateToProps)(AppUI);
