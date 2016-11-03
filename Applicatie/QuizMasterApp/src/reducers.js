import * as Redux from 'redux';
import quizMasterAPI from './quizMasterAPI'
// import initialFrontPageData from './frontPageData';
// import initialItemStatuses from './itemStatuses';
import update from 'immutability-helper';

const HeadState =
{
    quizMasterID: 0,
    currentPage: 1,
    quizId: 0
}

const LoginState = {
    username: "Mark",
    password: "Hoi",
    loginMessage: ""
};

const quizState = {
    items: GetAllQuizen(1),
    currentPage: 2,
};

const categorieState = {
    items: GetAllCategories(4),
    currentPage: 3,
};

const questionState = {
    items: GetAllQuestions(1),
    currentPage: 4,
};

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

export function startQuiz(id) {
    return {type: "startQuiz", id: id}
}

export function addRound(id) {
    return {type: "addRound", roundId: id}
}

export function addQuestion(id) {
    console.log("addQuestion", id);
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
                    'quizId': action.id
                };
                return copyAndUpdateObj(state, update);
        }
        case 'addRound':{
            let update = {
                'currentPage': 4,
                'roundId': action.roundId
            };
            return copyAndUpdateObj(state, update);
        }
        default:
            return state;
    }
}

export function GetAllCategories(id = 4) {
    return (dispatch) => {
        quizMasterAPI.getCategories(id, (err, items) => {
            if(err) {

                dispatch({ type: 'errorGetAllCategorieItems', success:false });
            } else {
                console.log(items);
                dispatch({ type: 'successGetAllCategorieItems', success:true, items });
            }
        });
    };
}

export function GetAllQuestions(quizId = 4, roundId = 1) {
    return (dispatch) => {
        quizMasterAPI.getQuestions(quizId, roundId, (err, items) => {
            if(err) {
                dispatch({ type: 'errorGetAllQuestionstems', success:false });
            } else {
                console.log(items);
                dispatch({ type: 'successGetAllQuestionsItems', success:true, items });
            }
        });
    };
}

export function GetAllQuizen(id = 1) {
    return (dispatch) => {
        quizMasterAPI.getQuiz(id, (err, items) => {
            if(err) {
                dispatch({ type: 'errorGetAllQuizItems', success:false });
            } else {
                dispatch({ type: 'successGetAllQuizItems', success:true, items });
            }
        });
    };
}

function quizReducer(state = quizState, action) {
    switch (action.type) {
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
    default:
    return state;
    }
}
function questionsReducer(state = questionState, action) {
    switch (action.type) {
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