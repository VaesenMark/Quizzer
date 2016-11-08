import * as Redux from 'redux';
import teamAppAPI from './teamAppAPI'
import {websockett} from './websocket'
import update from 'immutability-helper';
import {store} from './index'


// Action Creators:

// accepted from websocket
export function applianceAcceptedAction() {
    return {type: "applianceAccepted"};
}

export function questionClosedAction() {
    return {type: "questionClosed"};
}

export function showFinalScreen() {
    return {type: "showFinalScreen"};
}


// Reducer:

const baseState = {
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
                quizId: {$set: action.obj.quizId},
                teamId: {$set: action.obj.teamId}
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
            console.log('action',action);
            let changes = {
                question: {$set: action.result.question},
                roundNumber: {$set: action.result.roundNumber},
                questionNumber: {$set: action.result.questionNumber},
                currentScreen: {$set: 3},
            };

            return update(state, changes);
        }
        case 'questionClosed': {
            console.log('action',action);
            let changes = {
                currentScreen: {$set: 4}
            };

            return update(state, changes);
        }

        case 'showFinalScreen': {
            let changes = {
                currentScreen: {$set: 5}
            };
            console.log(update(state, changes));
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

    if(!teamname || teamname.length === 0) {
        return (dispatch) => {
            let obj = {message: "", success: false, quizId: 0, teamId: 0};
            obj.message = "Teamname cannot be empty";
            dispatch({type: 'loginFinished', obj});
        }
    }
    else {
        return (dispatch) => {
            teamAppAPI.login(password, teamname, function (err, result) {

                let obj = {message: "", success: false, quizId: 0, teamId: 0};
                if (err) {
                    if (result.message === "InvalidPassword") {
                        obj.message = "Invalid password. Make sure you entered it correctly";
                    }
                    else if(result.message === "TeamnameInUse") {
                        obj.message = "That teamname is already in use";
                    }
                    else {
                        console.log(err);
                        obj.message = "Something went wrong";
                    }
                } else {
                    websockett.sendJSON({messageType: "TeamLoggedIn", quizId: result.quizId});
                    obj.message = "Your team registration has been send. Wait for the quizmaster to approve it";
                    obj.success = true;
                    obj.quizId = result.quizId;
                    obj.teamId = result.teamId;
                }
                dispatch({type: 'loginFinished', obj});
            });
        }
    }

}




// Reducer:

const initialLoginState = {
    password: "",
    teamname: "",
    loginMessage: "",
    loginSuccess: null
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
                loginMessage: {$set: action.obj.message},
                loginSuccess: {$set: action.obj.success}
            };

            return update(state, changes);
        }
        case 'applianceDenied': {
            let changes = {
                loginMessage: {$set: "Your teamname has been denied. Please choose another one"},
                loginSuccess: {$set: false},
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

    if(!answer || answer.length === 0) {
        return (dispatch) => {
            dispatch({type: 'submitFailed', result: "Enter an answer first"});
        }
    }
    else {
        return (dispatch) => {
            teamAppAPI.submitAnswer(answer, function (err, result) {
                const message = result.message;
                if (err) {
                    dispatch({type: 'submitFailed', result: "Something went wrong"});
                } else {
                    websockett.sendJSON({
                        messageType: "AnswerSubmitted",
                        quizId: store.getState().base.quizId,
                        roundNumber: store.getState().base.roundNumber,
                        questionNumber: store.getState().base.questionNumber
                    });
                    dispatch({type: 'submitFinished', result: message});
                }
            });
        };
    }
}
export function questionStartedAction(questionNumber, roundNumber, questionId) {
    return (dispatch) => {
        console.log('ques1',questionNumber);
        teamAppAPI.getQuestion(questionId, function(err, result) {
            const question = result.question;
            let obj = {questionNumber: questionNumber, question: question, roundNumber: roundNumber};
            if(err) {
                dispatch({ type: 'getQuestionFailed', result: "Something went wrong" });
            } else {
                dispatch({ type: 'clearAnswer'});
                dispatch({ type: 'getQuestionSuccess', result: obj });
            }
        });
    };
}
export function AnswerAcceptedAction() {
    console.log('zipzip');
    return {type: "AnswerAccepted"};
}


// Reducer:

const initialAnswerInputState = {
    answer: "",
    message: "",
    accepted: false,
    submitSuccess: null
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
                message: {$set: action.result},
                submitSuccess: {$set: false}
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
                submitSuccess: {$set: true},
                message: {$set: action.result}
            };

            return update(state, changes);
        }
        case 'AnswerAccepted': {
            let changes = {
                accepted: {$set: true}
            };

            return update(state, changes);
        }
        case 'clearAnswer': {
            console.log('action',action);
            let changes = {
                answer: {$set: ""},
                accepted: {$set: false},
                submitSuccess: {$set: null},
                message: {$set: ""}
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

