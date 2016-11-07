import {store} from './index';
import {questionStarted, updateAnswers, getQuizes, updateTeamScores} from './reducers'

const websocket = new WebSocket('ws://localhost:3000');

websocket.onmessage = function(eventInfo) {
    console.log('message received');

    var message = JSON.parse(eventInfo.data);


    switch (message.messageType) {
        case "QuestionStartedScoreboard":
            console.log('1234');
            if (message.quizId == store.getState().base.quizId) {
                console.log('12345');
                store.dispatch(questionStarted(message.quizId));
            }
            break;
        case "QuestionClosedScoreboard":
            console.log('223');

            if (message.quizId == store.getState().base.quizId) {
                console.log('334');
                store.dispatch(updateAnswers(message.quizId));
            }
            break;
        case "QuestionApprovedScoreboard":
            console.log('666');
            console.log('mesQuiID', message.quizId);
            console.log('storQuiID', store.getState().base.quizId);
            if (message.quizId == store.getState().base.quizId) {
                console.log('667');
                store.dispatch(updateAnswers(message.quizId));
            }
            break;
        case "QuizCreated":
            console.log('777');
            console.log('mesQuiID', message.quizId);
            console.log('storQuiID', store.getState().base.quizId);
                console.log('667');
            if (store.getState().base.currentScreen == 1) {
                console.log('667');
                store.dispatch(getQuizes(message.quizId));
            }
            break;
        case "QuizTeamScoreChanged":
            console.log('777');
            console.log('mesQuiID', message.quizId);
            console.log('storQuiID', store.getState().base.quizId);
            console.log('667');
            if (message.quizId == store.getState().base.quizId) {
                console.log('667');
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