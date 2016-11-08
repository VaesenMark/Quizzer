import React from 'react'
import * as ReactRedux from 'react-redux';
import {Login} from './Login';
import {QuestionInput} from './AnswerInput';
import {AnswerJudgement} from './AnswerJudgement';
import WaitingRoomUI from './WaitingRoom';
import {FinalUI} from './Final';

class AppUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let screenContent;
        if (this.props.currentScreen == 1) {
            screenContent =
                <div>
                    <Login/>
                </div>
        } else if (this.props.currentScreen == 2) {
            screenContent =
                <div>
                    <WaitingRoomUI/>
                </div>
        } else if (this.props.currentScreen == 3) {
            screenContent =
                <div>
                    <QuestionInput/>
                </div>
        } else if (this.props.currentScreen == 4) {
            screenContent =
                <div>
                    <AnswerJudgement/>
                </div>
        } else if (this.props.currentScreen == 5) {
            screenContent =
                <div>
                    <FinalUI/>
                </div>
        }
        else {
            screenContent =
                <div>
                    <AnswerJudgement/>
                </div>
        }
        return (
            <div className="container">
                {screenContent}
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        currentScreen: state.base.currentScreen,
        websocket: state.base.websocket,
        teamId: state.base.teamId
    }
}

export const App = ReactRedux.connect(mapStateToProps)(AppUI);
