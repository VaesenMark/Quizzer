import * as Redux from 'redux';
import teamAppAPI from './teamAppAPI'

import update from 'immutability-helper';


// Action Creators:

export function markAsSeenAction(listSize) {
    return {type: "markAsSeenAction", listSize};
}
export function toggleItemAction(item) {
    return {type: "toggleItemAction", item};
}

// Reducer:

const mainState = {
    currentScreen: 1,
    quizId: 0,
    teamId: 0,
    teamName: "",
    roundNumber: 0,
    questionNumber: 0
};

function asdfReducer(state = mainState, action) {
    switch (action.type) {
        case 'loginFinished': {
            let changes = {
                quizId: {$set: action.result.quizId},
                teamId: {$set: action.result.teamId}
            };

            return update(state, changes);
        }
        default:
            return state;
    }
}







// ------------- LOGIN REDUCER --------------

// Action Creators:

export function updatePasswordAction(password) {
    return {type: "updatePassword", password: password};
}
export function updateTeamnameAction(teamname) {
    return {type: "updateTeamname", teamname: teamname};
}
export function submitLoginAction(password, teamname) {
    return (dispatch) => {
        teamAppAPI.login(password, teamname, function(err, result) {
            if(err) {
                dispatch({ type: 'loginFailed', result: "Something went wrong" });
            } else {
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
        default:
            return state;
    }
}



// ------------- ANSWER INPUT REDUCER --------------

// Action Creators:

export function updateAnswerAction(answer) {
    return {type: "updateAnswer", answer: answer};
}
export function submitAnswerAction(answer, quizId, roundNumber, questionNumber) {
    return (dispatch) => {
        teamAppAPI.submitAnswer(answer, quizId, roundNumber, questionNumber, function(err, result) {
            const message = result.message;
            if(err) {
                dispatch({ type: 'submitFailed', result: "Something went wrong" });
            } else {
                dispatch({ type: 'submitFinished', result: message });
            }
        });
    };
}


// Reducer:

const initialAnswerInputState = {
    answer: "",
    message: ""
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
        case 'submitFinished': {
            let changes = {
                message: {$set: action.result}
            };

            return update(state, changes);
        }
        default:
            return state;
    }
}








export const mainReducer = Redux.combineReducers({
    main: asdfReducer,
    login: loginReducer,
    answer: answerInputReducer
});
