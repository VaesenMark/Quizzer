import * as Redux from 'redux';
import teamAppAPI from './teamAppAPI'

import update from 'immutability-helper';


// Action Creators:

// accepted from websocket
export function applianceAcceptedAction() {
    return {type: "applianceAccepted"};
}
// temp accept button
export function tempAcceptApplianceAction() {
    return {type: "applianceAccepted"};
}



// Reducer:

const baseState = {
    // currentScreen: 3,
    // quizId: 1,
    // teamId: 1,
    // teamName: "rets",
    // roundNumber: 1,
    // questionNumber: 1,
    // question: "Wat is blaat"
    currentScreen: 1,
    quizId: 0,
    teamId: 0,
    teamName: "",
    roundNumber: 0,
    questionNumber: 0,
    question: "",
    questionId: 0
};

function baseReducer(state = baseState, action) {
    switch (action.type) {
        case 'loginFinished': {
            let changes = {
                quizId: {$set: action.result.quizId},
                teamId: {$set: action.result.teamId}
            };
            return update(state, changes);
        }
        case 'applianceAccepted': {
            let changes = {
                currentScreen: {$set: 2}
            };
            return update(state, changes);
        }
        case 'getQuestionSuccess': {
            let changes = {
                questionId: {$set: action.questionId},
                roundNumber: {$set: action.roundNumber},
                questionNumber: {$set: action.questionNumber}
            };

            return update(state, changes);
        }
        default:
            return state;
    }
}







// ------------- LOGIN REDUCER --------------

// Action Creators:

// Update text input
export function updatePasswordAction(password) {
    return {type: "updatePassword", password: password};
}
// Update text input
export function updateTeamnameAction(teamname) {
    return {type: "updateTeamname", teamname: teamname};
}
// Appliance denied from websocket
export function applianceDeniedAction() {
    return {type: "applianceDenied"};
}
// Login api call
export function submitLoginAction(password, teamname) {
    return (dispatch) => {
        teamAppAPI.login(password, teamname, function(err, result) {
            if(err) {
                dispatch({ type: 'loginFailed', result: "Something went wrong" });
            } else {
                console.log('suc', result);
                dispatch({ type: 'loginFinished', result });
            }
        });
    };
}




// Reducer:

const initialLoginState = {
    password: "",
    teamname: "",
    loginMessage: "",
    blaat: ""
};

function loginReducer(state = initialLoginState, action) {
    switch (action.type) {
        case 'updatePassword': {
            let changes = {
                password: {$set: action.password}
            };

            return update(state, changes);
        }
        case 'updateTeamname': {
            let changes = {
                teamname: {$set: action.teamname}
            };

            return update(state, changes);
        }
        case 'loginFinished': {
            let changes = {
                loginMessage: {$set: action.result.message}
            };

            return update(state, changes);
        }
        case 'loginFailed': {
            let changes = {
                loginMessage: {$set: action.result}
            };

            return update(state, changes);
        }
        case 'applianceDenied': {
            let changes = {
                loginMessage: {$set: "Your teamname has been denied. Please choose another one"}
            };
            return update(state, changes);
        }
        default:
            return state;
    }
}



// ------------- ANSWER INPUT REDUCER --------------

// Action Creators:

export function updateAnswerAction(answer) {
    return {type: "updateAnswer", answer: answer};
}
export function submitAnswerAction(answer) {
    return (dispatch) => {
        teamAppAPI.submitAnswer(answer, function(err, result) {
            const message = result.message;
            if(err) {
                dispatch({ type: 'submitFailed', result: "Something went wrong" });
            } else {
                dispatch({ type: 'submitFinished', result: message });
            }
        });
    };
}
export function questionStartedAction(questionId, roundNumber, questionNumber) {
    return (dispatch) => {
        teamAppAPI.getQuestion(questionId, function(err, result) {
            const question = result.question;
            let obj = {questionId: questionId, question: question, roundNumber: roundNumber, questionNumber: questionNumber};
            if(err) {
                dispatch({ type: 'getQuestionFailed', result: "Something went wrong" });
            } else {
                dispatch({ type: 'getQuestionSuccess', result: obj });
            }
        });
    };
}
export function answerJudgedAction(accepted) {
    return {type: "accepted", result: accepted};
}


// Reducer:

const initialAnswerInputState = {
    answer: "",
    message: "",
    accepted: false
};

function answerInputReducer(state = initialAnswerInputState, action) {
    switch (action.type) {
        case 'updateAnswer': {
            let changes = {
                answer: {$set: action.answer}
            };

            return update(state, changes);
        }
        case 'submitFailed': {
            let changes = {
                message: {$set: action.result}
            };

            return update(state, changes);
        }
        case 'getQuestionFailed': {
            let changes = {
                message: {$set: action.result}
            };

            return update(state, changes);
        }
        case 'submitFinished': {
            let changes = {
                accepted: {$set: action.result}
            };

            return update(state, changes);
        }
        case 'answerJudgedAction': {
            let changes = {
                accepted: {$set: action.result}
            };

            return update(state, changes);
        }
        default:
            return state;
    }
}








export const mainReducer = Redux.combineReducers({
    base: baseReducer,
    login: loginReducer,
    answer: answerInputReducer
});

