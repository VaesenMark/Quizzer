import * as Redux from 'redux';
import scoreBoardAPI from './scoreBoardAPI'

import update from 'immutability-helper';


// Action Creators:

// Websocket calls
export function updateAnswers(quizId) {
    return (dispatch) => {
        scoreBoardAPI.getScoreboardAnswers(quizId, function(err, answers) {
            if(err) {
                console.log('error');
            } else {
                dispatch({ type: 'updateAnswers', answers });
            }
        });
    };
}

export function questionStarted(quizId) {
    console.log('questionStarted1');
    return (dispatch) => {
        scoreBoardAPI.getScoreBoardOverview(quizId, function(err, quiz) {
            if(err) {
                console.log('error');
            } else {
                dispatch({ type: 'updateScoreboardOverview', quiz });
            }
        });
    };
}


// Normal calls
export function getQuizes() {
    return (dispatch) => {
        scoreBoardAPI.getQuizes(function(err, quizes) {
            if(err) {
                console.log('error');
            } else {
                dispatch({ type: 'quizesFetched', quizes });
            }
        });
    };
}

export function quizSelectedAction(quizId, quizStatus) {
    return (dispatch) => {
        scoreBoardAPI.getQuiz(quizId, function(err, quiz) {
            if(err) {
                console.log('error');
            } else {
                if (err) {
                    console.log('error');
                } else {
                    if (quiz.status == 1) {

                    }
                    else if (quiz.status == 2) {
                        dispatch({type: 'showQuizPassword', quiz});
                    }
                    else {
                        scoreBoardAPI.getScoreBoardOverview(quizId, function (err, quiz) {
                            if (err) {
                                console.log('error');
                            } else {
                                dispatch({type: 'updateScoreboardOverview', quiz});
                            }
                        });
                    }
                }
            }
        });
    };
}

export function updateTeamScores(quizId) {
    return (dispatch) => {
        scoreBoardAPI.getTeams(function(err, teams) {
            if(err) {
                console.log('error');
            } else {
                if(err) {
                    console.log('error');
                } else {
                    let quizTeams = [];
                    for(let team of teams) {
                        if(team.quizID == quizId) {
                            quizTeams.push(teams)
                        }
                    }
                    dispatch({ type: 'updateTeamScores', teams });
                }

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
    teamSubmissions: null,
    password: null,
    teamScores: null
};

function baseReducer(state = baseState, action) {
    switch (action.type) {
        case 'updateScoreboardOverview': {
            let changes = {
                currentScreen: {$set: 2},
                quizId: {$set: action.quiz.quizId},
                roundNumber: {$set: action.quiz.roundNumber},
                questionNumber: {$set: action.quiz.questionNumber},
                question: {$set: action.quiz.question},
                category: {$set: action.quiz.category},
                teamSubmissions: {$set: null}
            };
            return update(state, changes);
        }
        case 'quizesFetched': {
            let changes = {
                activeQuizes: {$set: action.quizes}
            };
            return update(state, changes);
        }
        case 'showQuizPassword': {
            let changes = {
                password: {$set: action.quiz.password}
            };
            return update(state, changes);
        }
        case 'updateAnswers': {
            let changes = {
                teamSubmissions: {$set: action.answers}
            };
            return update(state, changes);
        }
        case 'updateTeamScores': {
            let changes = {
                teamScores: {$set: action.teams}
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

