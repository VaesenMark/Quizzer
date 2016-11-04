import React from 'react'
import * as ReactRedux from 'react-redux';
import {Login} from './Login';
import {QuestionInput} from './AnswerInput';
import WaitingRoomUI from './WaitingRoom';

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
                <WaitingRoomUI/>
             </div>
      } else if(this.props.currentScreen == 3) {
          screenContent =
              <div>
                  <QuestionInput/>
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
       currentScreen: state.main.currentScreen,
       websocket: state.main.websocket
   }
}

export const App = ReactRedux.connect(mapStateToProps)(AppUI);
