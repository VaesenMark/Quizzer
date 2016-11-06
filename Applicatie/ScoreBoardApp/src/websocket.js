import {store} from './index';
import {applianceAccepted, applianceDenied, questionStarted, answerJudged} from './reducers'

const websocket = new WebSocket('ws://localhost:3000');

websocket.onmessage = function(eventInfo) {
    console.log('message received');

    var message = JSON.parse(eventInfo.data);

    // Team appliance accepted/denied
    switch (message.messageType) {
        case "TeamAppliance":
            if (message.teamId == store.getState().base.teamId) {
                if (message.accepted) {
                    store.dispatch(applianceAccepted());
                }
                else {
                    store.dispatch(applianceDenied());
                }
            }
            break;
        case "QuestionStarted":
            if (message.quizId == store.getState().base.quizId) {
                store.dispatch(questionStarted(message.questionId, message.roundNumber, message.questionNumber));
            }
            break;
        case "AnswerJudged":
            if (message.quizId == store.getState().base.quizId && message.teamId == store.getState().base.teamId) {
                store.dispatch(answerJudged(message.quizId, message.teamId));
            }
            break;
        default:
            console.log("Unknown messageType:", message);
    }
};

websocket.sendJSON = function(data) {
    this.send(JSON.stringify(data));
};

export const websockett = websocket;