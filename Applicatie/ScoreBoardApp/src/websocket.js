import {store} from './index';
import {questionStarted, updateAnswers, getQuizes, updateTeamScores} from './reducers'

const websocket = new WebSocket('ws://localhost:3000');

websocket.onmessage = function(eventInfo) {

    var message = JSON.parse(eventInfo.data);


    switch (message.messageType) {
        case "QuestionStartedScoreboard":
            if (message.quizId == store.getState().base.quizId) {
                store.dispatch(questionStarted(message.quizId));
            }
            break;
        case "QuestionClosedScoreboard":

            if (message.quizId == store.getState().base.quizId) {
                store.dispatch(updateAnswers(message.quizId));
            }
            break;
        case "QuestionApprovedScoreboard":
            if (message.quizId == store.getState().base.quizId) {
                store.dispatch(updateAnswers(message.quizId));
            }
            break;
        case "QuizCreated":
            if (store.getState().base.currentScreen == 1) {
                store.dispatch(getQuizes(message.quizId));
            }
            break;
        case "QuizTeamScoreChanged":
            if (message.quizId == store.getState().base.quizId) {
                store.dispatch(updateTeamScores(message.quizId));
            }
            break;

        default:
    }
};

websocket.sendJSON = function(data) {
    this.send(JSON.stringify(data));
};

export const websockett = websocket;