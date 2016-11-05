import * as Redux from 'redux';
import scoreBoardAPI from './scoreBoardAPI'

import update from 'immutability-helper';


// Action Creators:

export function getQuizes(quizId) {
    console.log('get?');
    return (dispatch) => {
        scoreBoardAPI.getQuizes(quizId, function(err, quizes) {
            if(err) {
                console.log('error');
            } else {
                console.log('quizesRetreived', result);
                dispatch({ type: 'quizesFetched', quizes });
            }
        });
    };
}

export function quizSelectedAction(quizId) {
    return (dispatch) => {
        scoreBoardAPI.getQuiz(quizId, function(err, quiz) {
            if(err) {
                console.log('error');
            } else {
                console.log('quizRetreived', result);
                dispatch({ type: 'quizSelected', quiz });
            }
        });
    };
}




// Reducer:

const baseState = {
    currentScreen: 1,
    quizId: 0,
    teamName: "",
    roundNumber: 0,
    questionNumber: 0,
    question: "",
    activeQuizes: null,
    teamSubmissions: null
};

function baseReducer(state = baseState, action) {
    switch (action.type) {
        case 'quizSelected': {
            let changes = {
                currentScreen: {$set: 2},
                quizId: {$set: action.result.quizId},
                roundNumber: {$set: action.result.rounds.slice(-1)[0].roundNumber},
                questionNumber: {$set: action.result.rounds.slice(-1)[0].playedQuestions.slice(-1)[0].questionNumber},
            };
            return update(state, changes);
        }
        case 'quizesFetched': {
            let changes = {
                activeQuizes: {$set: action.result}
            };
            return update(state, changes);
        }
        default:
            return state;
    }
}






export const mainReducer = Redux.combineReducers({
    base: baseReducer
});

