import {store} from './index';
import {newAnswerAvailable, newTeamApplianceAvailable} from './reducers'

console.log('hoi');

const websocket = new WebSocket('ws://localhost:3000');

websocket.onmessage = function(eventInfo) {
    console.log('message received');

    var message = JSON.parse(eventInfo.data);

    // Team appliance accepted/denied
    console.log('message', message);
    switch (message.messageType) {
        case "AnswerSubmitted":
            if (message.quizId == store.getState().MainState.quizItem._id) {
                console.log('222');
                store.dispatch(newAnswerAvailable(message.quizId, message.roundNumber, message.questionNumber));
            }
            break;
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