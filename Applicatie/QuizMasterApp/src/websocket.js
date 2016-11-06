import {store} from './index';
import {newAnswerAvailable, newTeamApplianceAvailable} from './reducers'

const websocket = new WebSocket('ws://localhost:3000');

websocket.onmessage = function(eventInfo) {
    console.log('message received');

    var message = JSON.parse(eventInfo.data);


    console.log('message', message);
    switch (message.messageType) {
        // New answer available
        case "AnswerSubmitted":
            console.log('88888888888');
            console.log('88888',message);
            if (message.quizId == store.getState().MainState.quizItem._id) {
                console.log('222');
                store.dispatch(newAnswerAvailable(message.quizId, message.roundNumber, message.questionNumber));
            }
            break;
        // Team appliance available
        case "NewTeamAppliance":

            console.log('storeQuizId',message.quizId == store.getState().MainState.quizItem._id);
            if (message.quizId == store.getState().MainState.quizItem._id) {
                console.log('222');
                store.dispatch(newTeamApplianceAvailable(message.quizId));
            }
            break;
        default:
            // console.log("Unknown messageType:", message);
    }
};

websocket.sendJSON = function(data) {
    this.send(JSON.stringify(data));
};

export const websockett = websocket;