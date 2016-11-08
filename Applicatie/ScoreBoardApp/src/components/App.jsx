import React from 'react'
import * as ReactRedux from 'react-redux';
import {QuizSelection} from './QuizSelection';
import {RunningQuiz} from './RunningQuiz';
import {TeamScores} from './TeamScores';
import {PasswordScreen} from './Password';


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
        } else if (this.props.currentScreen == 3) {
            screenContent =
                <div>
                    <TeamScores/>
                </div>
        }
        else if (this.props.currentScreen == 4) {
            screenContent =
                <div>
                    <PasswordScreen/>
                </div>
        }
        return (
            <div className="container">
                <h1>Scoreboard</h1>
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
