import * as Redux from 'redux';
import quizMasterAPI from './quizMasterAPI'
// import initialFrontPageData from './frontPageData';
// import initialItemStatuses from './itemStatuses';
import update from 'immutability-helper';
import {websockett} from './websocket'
const minerrStatuscode = 400;

const MainState = {
    quizMasterID: 0,
    currentPage: 1,
    quizItem: '',
    categoryItem: '',
    questionItem: ''
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
    recentQuestion: ''
};

const playedQuestionsState ={
    answers: '',
    message: ''
}

const teamState = {
    teams: '',
    message:'',
}

// Websocket functions
export function newAnswerAvailable(quizID, roundNumber, questionNumber){
    console.log('11');
    return (dispatch) => {
        quizMasterAPI.getPlayedQuestionsAnswers(quizID, roundNumber, questionNumber, (err, response) => {
            console.log('22');
            if(err) {
                console.log('33');
                console.log('Error getting answers');
            }
            else {
                console.log('44');
                if(response.status >= minerrStatuscode){
                    console.log('55');
                    console.log('Error getting answers');
                }
                else {
                    console.log('66');
                    console.log('response',response);
                    dispatch({type: "succesPlayedQuestions", answers: response});
                }
            }
        });
    }
}

export function newTeamApplianceAvailable(quizId){
    console.log('1111');
    return (dispatch) => {
        quizMasterAPI.getTeams(quizId, (err, response) => {
            if(err) {
                dispatch({ type: 'errorGetTeams', success:false, message: err });
            } else {
                if(response.status >= minerrStatuscode){
                    dispatch({type: "errorGetTeams", message: response.message});
                }
                else{
                    dispatch({ type: 'succesGetTeams', success:true, teams: response });
                }
            }
        });
    };
}


// Normal functions
export function closeQuestion(quizID, roundNumber, questionNumber){
    return (dispatch) => {
        quizMasterAPI.getPlayedQuestionsAnswers(quizID, roundNumber, questionNumber, (err, response) => {
            if(err) {
                dispatch({type: "errorPlayedQuestion", message: err});
            }
            else {
                if(response.status >= minerrStatuscode){
                    dispatch({type: "errorPlayedQuestion", message: response.message});
                }
                else {
                    websockett.sendJSON({messageType: "CloseQuestion", quizId: quizID});
                    websockett.sendJSON({messageType: "QuestionClosedScoreboard", quizId: quizID});
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

                    quizMasterAPI.getQuiz(response._id, (err, response) => {
                        if (err) {
                            console.log(err)
                            dispatch({type: 'errorGetAllQuizItems', message: response});
                        } else {
                            dispatch({type: 'successGetAllQuizItems', success: true, items: response});
                        }
                    });
                }
            }
        });
    }
}

export function closeQuiz(quizID, quizMasterID){
    return (dispatch) => {

        quizMasterAPI.closeQuiz(quizID, quizMasterID, (err, response)=> {
            if (err) {
                dispatch({type: 'errorCloseQuiz', message: " The quiz can't be closed"});
            }
            else {
                dispatch({type: 'succesCloseQuiz', message: " The quiz is be closed"});
                quizMasterAPI.getQuiz(quizMasterID, (err, response) => {
                    if (err) {
                        dispatch({type: 'errorGetAllQuizItems', message: err});
                    } else {
                        dispatch({type: 'successGetAllQuizItems', success: true, items: response});
                    }
                });
            }
        })
    }
}

export function closeAndEndTheQuiz(quizID, quizMasterID) {
    return (dispatch) => {

        quizMasterAPI.closeQuiz(quizID, quizMasterID, (err, response)=> {
            if (err) {
                dispatch({type: 'errorCloseQuiz', message: " The quiz can't be closed"});
            }
            else {
                dispatch({type: 'succesCloseQuiz', message: " The quiz is be closed"});
                quizMasterAPI.getQuiz(quizMasterID, (err, response) => {
                    if (err) {
                        dispatch({type: 'errorGetAllQuizItems', message: err});
                    } else {
                        if (response.status >= minerrStatuscode) {
                            dispatch({type: "errorGetAllQuizItems", message: response.message});
                        }
                        else {
                            dispatch({type: 'successGetAllQuizItems', success: true, items: response});
                            quizMasterAPI.endRound(quizID, (err, response) => {
                                if (err) {
                                    dispatch({type: 'errorEndRound', success: false, message: response.message});
                                }
                                else {

                                    dispatch({type: 'goToQuiz'});
                                }
                            })
                        }
                    };
                })
            }
        })
    };
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
        console.log(item);
        quizMasterAPI.getCategories(item._id, (err, response) => {
            if(err) {

                dispatch({ type: 'errorGetCategoriesItems', success:false, message: err });
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorGetCategoriesItems", message: response.message});
                }
                else {
                    dispatch({type: 'successGetCategoriesItems', success: true, items: response});
                    dispatch({type: "goToCategories", item: item});
                }
            }
        });
    };
}

export function addRound(quizID, categoryID) {

    return (dispatch) => {
            quizMasterAPI.setnewRound(quizID, categoryID, (err, response) => {
                console.log('nrnn',response);
                if(err) {
                    dispatch({type: "errorSetNewRound", message: err});
                } else {
                    console.log('1');
                    if (response.status >= minerrStatuscode) {
                        dispatch({type: "errorSetNewRound", message: response.message});
                    }
                    else {
                        console.log('2');
                        dispatch({type: "succesSetNewRound", roundNumber: response.roundNumber});
                        dispatch({type: "goToQuestions", cattegory: response});

                        quizMasterAPI.getQuestions(quizID, response.roundNumber, (err, items) => {
                            console.log('3');
                            console.log('3',items);
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
                    dispatch({type: 'successGetCategoriesItems', success: true, items: response});
                    quizMasterAPI.endRound(quiz._id, (err, response) => {
                        if(err){
                            dispatch({ type: 'errorEndRound', success:false, message: response.message});
                        }
                        else{

                            dispatch({type: "goToCategories", item: quiz});
                            dispatch({type: 'clearAnswers'});
                        }
                    });
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
                    dispatch({type: 'successGetAllQuestionsItems', success: true, items: response});
                    dispatch({type: 'goToQuestions'});
                    dispatch({type: 'clearAnswers'});
                }
            }
        });

    }
}

export function approveTeam(quizID,teamID){
    console.log(quizID,teamID);
    return (dispatch) => {
        quizMasterAPI.approveTeam(quizID, teamID, (err, response) => {
            console.log(response);
            if (err) {
                dispatch({type: 'errorTeamApprove', success: false, message: response.message});
                console.log("test1",response.status, response.message);
            } else {
                console.log(response.status);
                if (response.status >= minerrStatuscode) {
                    console.log(response.status, response.message);
                    dispatch({type: "errorTeamApprove", message: response.message});
                }
                else {
                    dispatch({type: 'succesTeamApprove', success: true, teams: response});
                    quizMasterAPI.getTeams(quizID, (err, response) => {
                        if (err) {
                            dispatch({type: 'errorGetTeams', success: false, message: err});
                            console.log("test2",response.status, response.message);
                        } else {
                            if (response.status >= minerrStatuscode) {
                                dispatch({type: "errorTeamApprove", message: response.message});
                            }
                            else {
                                websockett.sendJSON({messageType: "TeamApplianceJudged", teamId: teamID, accepted: true});
                                dispatch({type: 'succesGetTeams', success: true, teams: response});
                            }
                        }
                    });
                }
            }
        });
    }
}

export function judgeAnswerAction(teamId, accepted, quizId){
    return (dispatch) => {
        quizMasterAPI.approveTeamAnswer(teamId, (err, response) => {
            if (err) {
                console.log('11111');
                dispatch({type: 'errorTeamAnswerApprove', success: false, message: err});
            } else {
                console.log('22222');
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorTeamAnswerApprove", message: response.message});
                }
                else {
                    console.log('33333');
                    websockett.sendJSON({messageType: "AnswerAccepted", teamId});
                    websockett.sendJSON({messageType: "QuestionApprovedScoreboard", quizId: quizId});
                    dispatch({type: 'successTeamAnswerApprove', success: true, response});
                }
            }
        });
    }
}

export function AddQuiz(ID){

    return (dispatch) => {
        quizMasterAPI.addQuiz(ID, (err, response) => {
            if(err) {
                dispatch({ type: 'errorAddQuizItems', message:"quiz can't be created" });
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorAddQuizItems", message: response.message});
                }
                else {
                    //todo de andere functie aanroepen
                    quizMasterAPI.getQuiz(ID, (err, response) => {
                        if (err) {
                            dispatch({type: 'errorGetAllQuizItems', message: err});
                        } else {
                            if (response.status >= minerrStatuscode) {
                                dispatch({type: "errorGetAllQuizItems", message: response.message});
                            }
                            else {
                                websockett.sendJSON({messageType: "QuizCreated"});
                                dispatch({type: 'successGetAllQuizItems', success: true, items: response});
                            }
                        }
                    });
                }
            }
        });
    };
}

export function addQuestion(quizID, roundNumber, question){
    return (dispatch) => {
        quizMasterAPI.addQuestion(quizID, roundNumber,question._id, (err, response) => {
            if(err) {
                dispatch({ type: 'errorSaveQuestions', success:false, message: err });
            } else {
                if (response.status >= minerrStatuscode) {
                    dispatch({type: "errorSaveQuestions", message: response.message});
                }
                else {
                    websockett.sendJSON({messageType: "QuestionStarted", quizId: quizID, questionNumber: response.questionNumber, roundNumber: roundNumber, questionId: questionID});
                    websockett.sendJSON({messageType: "QuestionStartedScoreboard", quizId: quizID});
                    dispatch({type: 'successSaveQuestion', success: true, questionNumber: response.questionNumber, item: question});
                    dispatch({
                        type: 'goToClosePage',
                        success: true,
                        quizID: quizID,
                        roundNumber: roundNumber,
                        questionNumber: response.questionNumber
                    });
                }


            }
        });
    };
}


function quizReducer(state = quizState, action) {
    switch (action.type) {
        case 'errorCloseQuiz':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'succesCloseQuiz':{
            let update = {
                'message': action.message
            };
            return copyAndUpdateObj(state, update);
        }
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
            console.log(action.item);
            let update = {
                'message': '',
                'items': action.questionNumber,
                'recentQuestion': action.item
            };
            console.log(copyAndUpdateObj(state, update))
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
        case 'errorEndRound':{
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
                'answers': action.answers.answers
            };
            return copyAndUpdateObj(state, update);
        }
        case 'clearAnswers': {
            let update = {
                'answers': []
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
        case 'goToQuiz':{
            let update = {
                'currentPage': 2,
            };
            return copyAndUpdateObj(state, update);
        }
        case 'saveSelectedQuizId': {
            let update = {
                'quizId': action.quizId
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