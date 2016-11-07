import {store} from './index';
import {
    applianceDeniedAction, applianceAcceptedAction, questionStartedAction, AnswerAcceptedAction, questionClosedAction,showFinalScreen
} from './reducers';

const websocket = new WebSocket('ws://localhost:3000');

websocket.onmessage = function(eventInfo) {

    var message = JSON.parse(eventInfo.data);


    switch (message.messageType) {

        // Your appliance is accepted/denied
        case "TeamApplianceJudged":
            if (message.teamId == store.getState().base.teamId) {
                if (message.accepted) {
                    store.dispatch(applianceAcceptedAction());
                }
                else {
                    store.dispatch(applianceDeniedAction());
                }
            }
            break;

        // New question just started
        case "QuestionStarted":
            if (message.quizId == store.getState().base.quizId) {
                store.dispatch(questionStartedAction(message.questionNumber, message.roundNumber, message.questionId));
            }
            break;

        // Your answer is accepted
        case "AnswerAccepted":
            if (message.teamId == store.getState().base.teamId) {
                store.dispatch(AnswerAcceptedAction());
            }
            break;

        // The question is closed
        case "QuestionClosed":
            if (message.quizId == store.getState().base.quizId) {
                store.dispatch(questionClosedAction());
            }
            break;

        // The question is closed
        case "showFinalScreen":
            console.log("websockets",message.quizID,store.getState().base.quizId);
            if (message.quizID == store.getState().base.quizId) {
                store.dispatch(showFinalScreen());
            }
            break;
        default:

    }
};

websocket.sendJSON = function(data) {
    this.send(JSON.stringify(data));
};

export const websockett = websocket;