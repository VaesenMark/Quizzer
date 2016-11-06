import * as Redux from 'redux';
import quizMasterAPI from './quizMasterAPI'
// import initialFrontPageData from './frontPageData';
// import initialItemStatuses from './itemStatuses';
import update from 'immutability-helper';
const minerrStatuscode = 400;

const MainState = {
    quizMasterID: 0,
    currentPage: 1,
    quizItem: '',
    categoryItem: '',
    questionItem: '',
}

const LoginState = {
    username: "Mark",
    password: "Hoi",
    message: ""
};

const quizState = {
    items: '',
    selectedItem: 0,
    message: '',
};

const roundState = {
    items: '',
    selectedItem: 0,
    roundNumber: 1,
    message: ''
};

const questionState = {
    items: '',
    questionNumber:0,
    roundNumber:0,
    quizID:0,
    message:'',
};

const playedQuestionsState ={
    answers: '',
    message: ''
}

const teamState = {
    teams: '',
    message:'',
}

export function closeQuestion(quizID, roundID, roundNumber){
    return (dispatch) => {
        quizMasterAPI.getPlayedQuestionsAnswers(quizID, roundID, roundNumber, (err, response) => {
            if(err) {
                dispatch({type: "errorPlayedQuestion", message: err});
            }
            else {
                if(response.status >= minerrStatuscode){
                    dispatch({type: "errorPlayedQuestion", message: response.message});
                }
                else {
                    dispatch({type: "succesPlayedQuestions", answers: response});
                    dispatch({type: "goToCheckPage"});
                }
            }
        });
    }

}

export function loginAction(username, password) {
    return (dispatch) => {
        quizMasterAPI.getLogin( username, password, function(err, response) {
            if (err ) {
                dispatch( {type: "loginFailed", message: response.message})
            }
            else {
                if(response.status >= minerrStatuscode){
                    dispatch({type: "loginFailed", message: response.message});
                }
                else {
                    dispatch({type: "loginSucces", id: response._id});

                    quizMasterAPI.getQuiz(response._id, (err, items) => {
                        if (err) {
                            dispatch({type: 'errorGetAllQuizItems', message: " The quiz can't be show try again"});
                        } else {
                            dispatch({type: 'successGetAllQuizItems', success: true, items});
                        }
                    });
                }
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
        quizMasterAPI.getTeams(item._id, (err, response) => {
            if(err) {
                dispatch({ type: 'errorGetTeams', success:false, message: err });
            } else {
                if(response.status >= minerrStatuscode){
                    dispatch({type: "errorGetTeams", message: response.message});
                }
                else{
                dispatch({ type: 'succesGetTeams', success:true, teams: response });
                dispatch({type: "checkTeams", quiz: item});
                }
            }
        });
    };
}

export function startQuiz(item) {
    return (dispatch) => {
        quizMasterAPI.getCategories(item._id, (err, response) => {
            if(err) {

                dispatch({ type: 'errorGetCategoriesItems', success:false, message: err });
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorGetCategoriesItems", message: response.message});
                }
                else {

                    dispatch({type: 'succesGetCategoriesItems', success: true, response});
                    dispatch({type: "goToCategories", item: item});
                }
            }
        });
    };
}

export function addRound(quizID, categoryID) {

    return (dispatch) => {
            quizMasterAPI.setnewRound(quizID, categoryID, (err, response) => {
                if(err) {
                    dispatch({type: "errorSetNewRound", message: err});
                } else {
                    if (response.status >= minerrStatuscode) {
                        dispatch({type: "errorSetNewRound", message: response.message});
                    }
                    else {
                        console.log(item.roundNumber);
                        dispatch({type: "succesSetNewRound", roundNumber: response.roundNumber});
                        dispatch({type: "goToQuestions", cattegory: response});

                        quizMasterAPI.getQuestions(quizID, response.roundNumber, (err, items) => {

                            if (err) {
                                dispatch({type: 'errorGetAllQuestionsItems', success: false, message: err});
                            } else {
                                if (response.status >= minerrStatuscode) {
                                    dispatch({type: "errorGetAllQuestionsItems", message: response.message});
                                }
                                else {
                                    dispatch({type: 'successGetAllQuestionsItems', success: true, items});
                                }
                            }
                        });
                    }
                }
            });
    };
}

/*
//todo nog gebruikt??

export function GetAllCategories(quizID) {
    return (dispatch) => {
        quizMasterAPI.getCategories(quizID, (err, items) => {
            if(err) {
                dispatch({ type: 'errorGetAllCategoryItems', success:false });
            } else {
                dispatch({ type: 'successGetAllCategorieItems', success:true, items });
            }
        });
    };
}
 */

export function getNextRound(quiz){
    return (dispatch) => {
        quizMasterAPI.getCategories(quiz._id, (err, response) => {
            if(err) {
                dispatch({ type: 'errorGetCategoriesItems', success:false, message: err});
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorGetCategoriesItems", message: response.message});
                }
                else {
                    dispatch({type: 'succesGetCategoriesItems', success: true, response});
                    dispatch({type: "goToCategories", item: quiz});
                }
            }
        });
    }
}

export function getNextQuestion(quizID,roundID){
    return (dispatch) => {
        quizMasterAPI.getQuestions(quizID, roundID, (err, response) => {

            if(err) {
                dispatch({ type: 'errorGetAllQuestionsItems', success:false, message: err });
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorGetAllQuestionsItems", message: response.message});
                }
                else {
                    dispatch({type: 'successGetAllQuestionsItems', success: true, response});
                    dispatch({type: 'goToQuestions'})
                }
            }
        });

    }
}

export function approveTeam(quizID,teamID){
    console.log(quizID,teamID);
    return (dispatch) => {
        quizMasterAPI.approveTeam(quizID, teamID, (err, response) => {
            if (err) {
                dispatch({type: 'errorTeamApprove', success: false, message: err});
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorGetAllQuestionsItems", message: response.message});
                }
                else {
                    dispatch({type: 'succesTeamApprove', success: true, teams: response});
                    quizMasterAPI.getTeams(quizID, (err, response) => {
                        if (err) {
                            dispatch({type: 'errorGetTeams', success: false, message: err});
                        } else {
                            if (response.status >= minerrStatuscode) {
                                dispatch({type: "errorGetAllQuestionsItems", message: response.message});
                            }
                            else {
                                dispatch({type: 'succesGetTeams', success: true, teams: response});
                            }
                        }
                    });
                }
            }
        });
    }
}

export function approveAnswerTeam(quizID,roundNumber,questionNumber,teamID){
    return (dispatch) => {
        quizMasterAPI.approveTeamAnswer(quizID, roundNumber, questionNumber, teamID, (err, response) => {
            if (err) {
                dispatch({type: 'errorTeamAnswerApprove', success: false, message: err});
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorTeamAnswerApprove", message: response.message});
                }
                else {
                    dispatch({type: 'successTeamAnswerApprove', success: true, response});
                }
            }
        });
    }
}

export function AddQuiz(ID){

    return (dispatch) => {
        quizMasterAPI.addQuiz(ID, (err, items) => {
            if(err) {
                dispatch({ type: 'errorAddQuizItems', message:"quiz can't be created" });
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorAddQuizItems", message: response.message});
                }
                else {
                    //todo de andere functie aanroepen
                    quizMasterAPI.getQuiz(ID, (err, items) => {
                        if (err) {
                            dispatch({type: 'errorGetAllQuizItems', message: " The quiz can't be show try again"});
                        } else {
                            if (response.status >= minerrStatuscode) {
                                dispatch({type: "errorGetAllQuizItems", message: response.message});
                            }
                            else {
                                dispatch({type: 'successGetAllQuizItems', success: true, items});
                            }
                        }
                    });
                }
            }
        });
    };
}

export function addQuestion(quizID, roundNumber, questionID){
    return (dispatch) => {
        quizMasterAPI.addQuestion(quizID, roundNumber,questionID, (err, response) => {
            if(err) {
                dispatch({ type: 'errorSaveQuestions', success:false, message: err });
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorSaveQuestions", message: response.message});
                }
                else {
                    dispatch({type: 'successSaveQuestion', success: true, questionNumber: response.questionNumber, items});
                    dispatch({
                        type: 'goToClosePage',
                        success: true,
                        quizID: quizID,
                        roundNumber: roundNumber,
                        questionNumber: items.questionNumber
                    });
                }


            }
        });
    };
}


function quizReducer(state = quizState, action) {
    switch (action.type) {
        case 'errorAddQuizItems':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'errorGetAllQuizItems':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
    }
        case 'successGetAllQuizItems':{
            let update = {
                'message': '',
                'items': action.items
            };
            return copyAndUpdateObj(state, update);
        }

        case 'errorSetNewRound':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
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
                'message': '',
                'items': action.questionNumber
            };
            return copyAndUpdateObj(state, update);
        }
        case 'errorGetAllQuestionsItems':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'successGetAllQuestionsItems':{
            let update = {
                'message': '',
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
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'successGetCategoriesItems':{
            let update = {
                'message': '',
                'items': action.items
            };
            return copyAndUpdateObj(state, update);
        }
        case 'succesSetNewRound':{
            let update = {
                'message': '',
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
        case 'errorGetTeams':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'succesGetTeams':{
            let update = {
                'message': '',
                'teams': action.teams
            };
            return copyAndUpdateObj(state, update);
        }
        case 'succesTeamApprove':{
            let update = {
                'message': '',
                'teams': action.teams
            };
            return copyAndUpdateObj(state, update);
        }
        case 'errorTeamApprove':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }

        default:
            return state;
    }
}

function PlayedQuestionReducer(state = playedQuestionsState, action) {
    switch (action.type) {
        case 'succesPlayedQuestions': {
            let update = {
                'message': '',
                'answers': action.answers
            };
            return copyAndUpdateObj(state, update);
        }
        case 'errorPlayedQuestions': {
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'errorTeamAnswerApprove': {
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'successTeamAnswerApprove': {
            //todo implementeren
            /*let update = {
             'message': '',
                'message': action.message
            };
            */
            return state;
        }
        default:
            return state;
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
                'message': action.message
            };
            return copyAndUpdateObj(state, update);

        }
        default:
            return state;
    }
}

function headReducer(state = MainState, action) {
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
//===========================================================================
//  Combining the reducers and their state into a single reducer managing
//  a single state
//---------------------------------------------------------------------------
function copyAndUpdateObj(copiedObject, update) {
    return Object.assign({}, copiedObject, update);
}

export const mainReducer = Redux.combineReducers({
    MainState: headReducer,
    LoginState: LoginReducer,
    QuizItemsState: quizReducer,
    RoundState: roundReducer,
    QuestionsState: questionsReducer,
    TeamState: teamReducer,
    PlayedQuestionState: PlayedQuestionReducer
});