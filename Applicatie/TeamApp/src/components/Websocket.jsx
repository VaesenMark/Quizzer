import React from 'react';
import * as ReactRedux from 'react-redux';
import {store} from '../index';

import {
    applianceDeniedAction, applianceAcceptedAction, questionStartedAction, answerJudgedAction
} from '../reducers';


export default class Websocket extends React.Component {
    constructor(props) {
        super(props);

        let me = this;

        const websocket = new WebSocket('ws://localhost:3000');

            websocket.onmessage = function(eventInfo) {
                console.log('message received');

                var message = JSON.parse(eventInfo.data);

                // Team appliance accepted/denied
                switch (message.messageType) {
                    case "TeamAppliance":
                        if (message.teamId == store.getState().base.teamId) {
                            if (message.accepted) {
                                me.props.applianceAccepted();
                            }
                            else {
                                me.props.applianceDenied();
                            }
                        }
                        break;
                    case "QuestionStarted":
                        if (message.quizId == store.getState().base.quizId) {
                            console.log('suc');
                                me.props.questionStarted(message.questionNumber, message.roundNumber);
                        }
                        break;
                    case "AnswerJudged":
                        if (message.quizId == store.getState().base.quizId && message.teamId == store.getState().base.teamId) {
                            me.props.answerJudged(message.quizId, message.teamId);
                        }
                        break;
                    default:
                        console.log("Unknown messageType:", message);
                }
            };
    }
    render() {
        return (
            <div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
    }
}


function mapDispatchToProps(dispatch) {
    return {
        applianceAccepted: () => dispatch(applianceAcceptedAction()),
        applianceDenied: () => dispatch(applianceDeniedAction()),
        questionStarted: (questionNumber, roundNumber) => dispatch(questionStartedAction(questionNumber, roundNumber)),
        answerJudged: () => dispatch(answerJudgedAction())
    }
}



export const WS =
    ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Websocket);
