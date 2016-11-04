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
    currentPage: 2,
};

const categorieState = {
    items: '',
    selectedItem: 0,
    currentPage: 3,
};

const questionState = {
    items: '',
    message: '',
    questionNumber:0,
    roundNumber:0,
    quizID:0

};
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
                console.log(response);
                dispatch( {type: "loginSucces", id: response._id})

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

export function startQuiz(item) {
    return {type: "startQuiz", item: item}
}

export function addRound(quizID, categoryID) {
    return (dispatch) => {
            quizMasterAPI.setnewRound(quizID, categoryID, (err, item) => {
                if(err) {
                    dispatch({type: "errorSetNewRound", message: err});
                } else {
                    console.log(item);
                    dispatch({type: "succesSetNewRound", cattegory: item});
                    dispatch({type: "setCategory", cattegory: item});
                }
            });
    };
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
        case 'logout': {
            let update = {
                'currentPage': 1,
                'quizMasterID': 0
            };
            return copyAndUpdateObj(state, update);
        }
        case 'startQuiz': {
                let update = {
                    'currentPage': 3,
                    'quizItem': action.item
                };
                return copyAndUpdateObj(state, update);
        }
        case 'setCategory':{
            let update = {
                'currentPage': 4,
                'categoryItem': action.cattegory
            };
            return copyAndUpdateObj(state, update);
        }

        case 'goToClosePage': {
            let update = {
                'currentPage': 5,
            };
            return copyAndUpdateObj(state, update);
        }
        case 'goToCheckPage': {
            let update = {
                'currentPage': 6,
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
                console.log(items);
                dispatch({ type: 'successGetAllCategorieItems', success:true, items });
            }
        });
    };
}

export function GetAllQuestions(quizID = 4, roundId = 1) {
    return (dispatch) => {
        quizMasterAPI.getQuestions(quizID, roundId, (err, items) => {

            if(err) {
                dispatch({ type: 'errorGetAllQuestionstems', success:false });
            } else {
                console.log(items);
                dispatch({ type: 'successGetAllQuestionsItems', success:true, items });
            }
        });
    };
}

export function GetAllQuizen(id) {

    return (dispatch) => {
        quizMasterAPI.getQuiz(id, (err, items) => {
            if(err) {
                console.log(err);
                dispatch({ type: 'errorGetAllQuizItems', success:false });
            } else {
                console.log(items);
                dispatch({ type: 'successGetAllQuizItems', success:true, items });
            }
        });
    };
}
export function getNextQuestion(quizID,roundID){
    return (dispatch) => {
        quizMasterAPI.getQuestions(quizID, roundID, (err, items) => {

            if(err) {
                dispatch({ type: 'errorGetAllQuestionstems', success:false });
            } else {
                console.log(items);
                dispatch({ type: 'successGetAllQuestionsItems', success:true, items });
                dispatch({type: 'setCategory'})
            }
        });

    }
}


export function AddQuiz(id){
    //todo de andere functie aanroepen
    return (dispatch) => {
        quizMasterAPI.addQuiz(id, (err, items) => {
            if(err) {
                dispatch({ type: 'errorAddQuizItems', message:"quiz can't be created" });
            } else {
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
            if(err) {
                dispatch({ type: 'errorSaveQuestions', success:false, message: err });
            } else {
                console.log("jsljf", items);
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
        case 'succesSetNewRound':{
            console.log("test", action.cattegory);
            return state;//return copyAndUpdateObj(state, update);
        }
        case 'errorSetNewRound':{
            console.log("test", action.message);
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
            console.log(action);
            console.log(copyAndUpdateObj(state, update));
            return copyAndUpdateObj(state, update);
        }
        default:
            return state;
    }
}

function categoriesReducer(state = categorieState, action) {
    switch (action.type) {
        case 'errorGetAllCategorieItems':{
            let update = {
                'errMessage': action.message
            };
            return copyAndUpdateObj(state, update);
        }
        case 'successGetAllCategorieItems':{
            let update = {
                'items': action.items
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
    categories: categoriesReducer,
    questions: questionsReducer
});