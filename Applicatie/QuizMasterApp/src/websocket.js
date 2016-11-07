import {store} from './index';
import {newAnswerAvailable, newTeamApplianceAvailable} from './reducers'

const websocket = new WebSocket('ws://localhost:3000');

websocket.onmessage = function(eventInfo) {
    console.log('message received');

    var message = JSON.parse(eventInfo.data);


    switch (message.messageType) {
        // New answer available
        case "AnswerSubmitted":
            if (message.quizId == store.getState().MainState.quizItem._id) {
                store.dispatch(newAnswerAvailable(message.quizId, message.roundNumber, message.questionNumber));
            }
            break;
        // Team applianceavailable
        case "NewTeamAppliance":

            if (message.quizId == store.getState().MainState.quizItem._id) {
                store.dispatch(newTeamApplianceAvailable(message.quizId));
            }
            break;
        default:
    }
};

websocket.sendJSON = function(data) {
    this.send(JSON.stringify(data));
};

export const websockett = websocket;