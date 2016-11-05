import React from 'react'
import * as ReactRedux from 'react-redux';
import {QuizSelection} from './QuizSelection';
import {RunningQuiz} from './RunningQuiz';
import {EndScreen} from './EndScreen';
import {WS} from './Websocket'

class AppUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let screenContent;
        if (this.props.currentScreen == 1) {
            screenContent =
                <div>
                    <QuizSelection/>
                </div>
        } else if (this.props.currentScreen == 2) {
            screenContent =
                <div>
                    <RunningQuiz/>
                </div>
        } else {
            screenContent =
                <div>
                    <EndScreen/>
                </div>
        }
        return (
            <div>
                <h1>Scoreboard</h1>
                <WS/>
                {screenContent}
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        currentScreen: state.base.currentScreen
    }
}

export const App = ReactRedux.connect(mapStateToProps)(AppUI);
