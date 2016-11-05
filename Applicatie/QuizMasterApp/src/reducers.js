import * as Redux from 'redux';
import quizMasterAPI from './quizMasterAPI'
// import initialFrontPageData from './frontPageData';
// import initialItemStatuses from './itemStatuses';
import update from 'immutability-helper';

const HeadState = {
    quizMasterID: 0,
    currentPage: 1,
    quizItem: '',
    categoryItem: '',
    questionItem: '',
}

const LoginState = {
    username: "Mark",
    password: "Hoi",
    loginMessage: ""
};

const quizState = {
    items: '',
    selectedItem: 0,
};

const roundState = {
    items: '',
    selectedItem: 0,
    roundNumber: 1,
};

const questionState = {
    items: '',
    message: '',
    questionNumber:0,
    roundNumber:0,
    quizID:0

};


const teamState = {
    teams: '',
}

export function closeQuestion(){
    return {type: "goToCheckPage"}
}

export function loginAction(username, password) {
    return (dispatch) => {
        quizMasterAPI.getLogin( username, password, function(err, response) {
            if (err) {
                dispatch( {type: "loginFailed", message: response.message})
            }
            else {
                if(response.status != 200){
                    dispatch( {type: "loginFailed", message: response.message})
                }
                dispatch( {type: "loginSucces", id: response._id});

                quizMasterAPI.getQuiz(response._id, (err, items) => {
                    if(err) {
                        dispatch({ type: 'errorGetAllQuizItems', message:" The quiz can't be show try again" });
                    } else {
                        dispatch({ type: 'successGetAllQuizItems', success:true, items });
                    }
                });
            }
        });
    }
}

export function editUsername(username) {
    return {type: "editUserName", username: username}
}

export function editPassword(password) {
    return {type: "editPassword", password: password}
}

export function logout() {
    return {type: "logout"}
}

export function goToCheckTeams(item) {
    return (dispatch) => {
        console.log(item);
        quizMasterAPI.getTeams(item._id, (err, items) => {
            if(err) {
                console.log(err);
                dispatch({ type: 'errorGetTeams', success:false });
            } else {
                console.log("teams", items);
                dispatch({ type: 'succesGetTeams', success:true, teams: items });
                dispatch({type: "checkTeams", quiz: item});
            }
        });
    };
}
export function startQuiz(item) {
    return (dispatch) => {
        console.log(item);
        quizMasterAPI.getCategories(item._id, (err, items) => {
            if(err) {

                dispatch({ type: 'errorGetCategoriesItems', success:false });
            } else {
                console.log("item",item);
                dispatch({ type: 'successGetCategoriesItems', success:true, items });
                dispatch({type: "goToCategories", item: item});
            }
        });
    };
}

export function addRound(quizID, categoryID) {

    return (dispatch) => {
            quizMasterAPI.setnewRound(quizID, categoryID, (err, item) => {
                if(err) {
                    dispatch({type: "errorSetNewRound", message: err});
                } else {
                    console.log(item.roundNumber);
                    dispatch({type: "succesSetNewRound", roundNumber: item.roundNumber});
                    dispatch({type: "goToQuestions", cattegory: item});

                    quizMasterAPI.getQuestions(quizID, item.roundNumber, (err, items) => {

                        if(err) {
                            dispatch({ type: 'errorGetAllQuestionsItems', success:false });
                        } else {
                            dispatch({ type: 'successGetAllQuestionsItems', success:true, items });}
                    });
                }
            });
    };
    return (dispatch) => {


    }
}


function LoginReducer(state = LoginState, action) {
    switch (action.type) {
        case 'editUserName': {
            let update = {
                'username': action.username
            };
            return copyAndUpdateObj(state, update);

        }
        case 'editPassword': {
            let update = {
                'password': action.password
            };
            return copyAndUpdateObj(state, update);
        }
        case 'loginFailed': {
            let update = {
                'loginMessage': action.message
            };
            return copyAndUpdateObj(state, update);

        }
        default:
            return state;
    }
}

function headReducer(state = HeadState, action) {
    switch (action.type) {

        case 'loginSucces': {
                let update = {
                'currentPage': 2,
                'quizMasterID': action.id
            };
            return copyAndUpdateObj(state, update);

        }
        case 'checkTeams': {
            let update = {
                'currentPage': 3,
                'quizItem' : action.quiz
            };
            return copyAndUpdateObj(state, update);

        }
        case 'logout': {
            let update = {
                'currentPage': 1,
                'quizMasterID': 0
            };
            return copyAndUpdateObj(state, update);
        }
        case 'goToCategories': {
                let update = {
                    'currentPage': 4,
                };
                return copyAndUpdateObj(state, update);
        }
        case 'goToQuestions':{
            let update = {
                'currentPage': 5,
                'categoryItem': action.cattegory
            };
            return copyAndUpdateObj(state, update);
        }

        case 'goToClosePage': {
            let update = {
                'currentPage': 6,
            };
            return copyAndUpdateObj(state, update);
        }
        case 'goToCheckPage': {
            let update = {
                'currentPage': 7,
            };
            return copyAndUpdateObj(state, update);
        }
        default:
            return state;
    }
}

export function GetAllCategories(quizID) {
    return (dispatch) => {
        quizMasterAPI.getCategories(quizID, (err, items) => {
            if(err) {
                dispatch({ type: 'errorGetAllCategorieItems', success:false });
            } else {
                dispatch({ type: 'successGetAllCategorieItems', success:true, items });
            }
        });
    };
}


export function getNextRound(quiz){
    return (dispatch) => {
        quizMasterAPI.getCategories(quiz._id, (err, items) => {
            if(err) {
                dispatch({ type: 'errorGetAllCategoriesItems', success:false });
            } else {
                dispatch({ type: 'successGetCategoriesItems', success:true, items });
                console.log(items)
                dispatch({type: "goToCategories", item: quiz});
            }
        });
    }
}

export function getNextQuestion(quizID,roundID){
    return (dispatch) => {
        quizMasterAPI.getQuestions(quizID, roundID, (err, items) => {

            if(err) {
                dispatch({ type: 'errorGetAllQuestionsItems', success:false });
            } else {
                dispatch({ type: 'successGetAllQuestionsItems', success:true, items });
                dispatch({type: 'goToQuestions'})
            }
        });

    }
}
export function approveTeam(quizID,teamID){
    quizMasterAPI.approveTeam(quizID,teamID, (err, items) => {

        if(err) {
            dispatch({ type: 'errorTeamApprove', success:false });
        } else {
            dispatch({ type: 'successTeamApprove', success:true, items });
        }
    });
}


export function AddQuiz(id){

    return (dispatch) => {
        quizMasterAPI.addQuiz(id, (err, items) => {
            if(err) {
                dispatch({ type: 'errorAddQuizItems', message:"quiz can't be created" });
            } else {
                //todo de andere functie aanroepen
                quizMasterAPI.getQuiz(id, (err, items) => {
                    if(err) {
                        dispatch({ type: 'errorGetAllQuizItems', message:" The quiz can't be show try again" });
                    } else {
                        dispatch({ type: 'successGetAllQuizItems', success:true, items });
                    }
                });
            }
        });
    };
}

export function addQuestion(quizID, roundNumber, questionID){
    return (dispatch) => {
        quizMasterAPI.addQuestion(quizID, roundNumber,questionID, (err, items) => {
            console.log("err", err, "items", items);
            if(err) {
                dispatch({ type: 'errorSaveQuestions', success:false, message: err });
            } else {

                dispatch({ type: 'goToClosePage', success:true, quizID: quizID, roundNumber:  roundNumber, questionNumber: items.questionNumber});
                dispatch({ type: 'successSaveQuestion', success:true, questionNumber: items.questionNumber, items });

            }
        });
    };
}


function quizReducer(state = quizState, action) {
    switch (action.type) {
        case 'errorAddQuizItems':{
            let update = {
                'errMessage': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'errorGetAllQuizItems':{
            let update = {
                'errMessage': action.message
            };
            return copyAndUpdateObj(state, update);
    }
        case 'successGetAllQuizItems':{
            let update = {
                'items': action.items
            };
            return copyAndUpdateObj(state, update);
        }

        case 'errorSetNewRound':{
            return state;
        }
    default:
    return state;
    }
}
function questionsReducer(state = questionState, action) {
    switch (action.type) {
        case 'errorSaveQuestions':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'successSaveQuestion':{
            let update = {
                'items': action.questionNumber
            };
            return copyAndUpdateObj(state, update);
        }
        case 'errorGetAllQuestionsItems':{
            let update = {
                'errMessage': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'successGetAllQuestionsItems':{
            let update = {
                'items': action.items
            };
            return copyAndUpdateObj(state, update);
        }
        case 'goToClosePage': {

            let update = {
                'quizID': action.quizID,
                'roundNumber': action.roundNumber,
                'questionNumber': action.questionNumber
            };
            return copyAndUpdateObj(state, update);
        }
        default:
            return state;
    }
}

function roundReducer(state = roundState, action) {
    switch (action.type) {
        case 'errorGetCategoriesItems':{
            let update = {
                'errMessage': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'successGetCategoriesItems':{
            let update = {
                'items': action.items
            };
            return copyAndUpdateObj(state, update);
        }
        case 'succesSetNewRound':{
            let update = {
                'roundNumber': action.roundNumber
            };
            return copyAndUpdateObj(state, update);
        }
        default:
            return state;
    }
}

function teamReducer(state = teamState, action) {
    switch (action.type) {
        case 'succesGetTeams':{
            console.log(action.teams);
            let update = {
                'teams': action.teams
            };
            return copyAndUpdateObj(state, update);
        }
        default:
            return state;
    }
}

//===========================================================================
//  Combining the reducers and their state into a single reducer managing
//  a single state
//---------------------------------------------------------------------------
function copyAndUpdateObj(copiedObject, update) {
    return Object.assign({}, copiedObject, update);
}

export const mainReducer = Redux.combineReducers({
    headState: headReducer,
    login: LoginReducer,
    quizItems: quizReducer,
    round: roundReducer,
    questions: questionsReducer,
    team: teamReducer
});