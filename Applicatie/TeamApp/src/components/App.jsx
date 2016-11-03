import React from 'react'
import * as ReactRedux from 'react-redux';
import {Login} from './Login';

class AppUI extends React.Component {
   constructor(props) {
      super(props);
   }
   render() {
      let screenContent;
      if(this.props.currentScreen == 1) {
         screenContent =
             <div>
                <Login/>
             </div>
      } else if(this.props.currentScreen == 2) {
         screenContent =
             <div>
                <Login/>
             </div>
      } else {
         screenContent =
             <div>
                <Login/>
             </div>
      }
      return (
          <div>
             {screenContent}
          </div>
      );
   }
}







function mapStateToProps(state) {
   return {
       currentScreen: state.main.currentScreen
   }
}

export const App = ReactRedux.connect(mapStateToProps)(AppUI);
