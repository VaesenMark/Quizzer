import {store} from './index';
import {
    applianceDeniedAction, applianceAcceptedAction, questionStartedAction, AnswerAcceptedAction, questionClosedAction
} from './reducers';

const websocket = new WebSocket('ws://localhost:3000');

websocket.onmessage = function(eventInfo) {
    console.log('message received');

    var message = JSON.parse(eventInfo.data);


    switch (message.messageType) {

        // Your appliance is accepted/denied
        case "TeamApplianceJudged":
            console.log('asd',message);
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
                console.log('suc');
                store.dispatch(questionStartedAction(message.questionNumber, message.roundNumber, message.questionId));
            }
            break;

        // Your answer is accepted
        case "AnswerAccepted":
            if (message.teamId == store.getState().base.teamId) {
                console.log('zipzip');
                store.dispatch(AnswerAcceptedAction());
            }
            break;

        // The question is closed
        case "QuestionClosed":
            if (message.quizId == store.getState().base.quizId) {
                console.log('bbbbb');
                store.dispatch(questionClosedAction());
            }
            break;
        default:

    }
};

websocket.sendJSON = function(data) {
    this.send(JSON.stringify(data));
};

export const websockett = websocket;