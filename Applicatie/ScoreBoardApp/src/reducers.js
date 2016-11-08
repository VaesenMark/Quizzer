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

export function endQuiz() {
    return (dispatch) => {

        dispatch({ type: 'endQuiz' });

    };
}


// Normal calls
export function getQuizes() {
    return (dispatch) => {
        scoreBoardAPI.getQuizes(function(err, quizes) {
            if(err) {
                console.log('error');
            } else {
                // Filter out closed quizes
                let filteredQuizes = [];
                for(let quiz of quizes) {
                    if(quiz.status != 4) {
                        filteredQuizes.push(quiz)
                    }
                }
                dispatch({ type: 'quizesFetched', filteredQuizes });
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
                            quizTeams.push(team)
                        }
                    }
                    dispatch({ type: 'updateTeamScores', quizTeams });
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
                activeQuizes: {$set: action.filteredQuizes}
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
                teamScores: {$set: action.quizTeams}
            };
            return update(state, changes);
        }
        case 'endQuiz': {
            let changes = {
                currentScreen: {$set: 3}
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

