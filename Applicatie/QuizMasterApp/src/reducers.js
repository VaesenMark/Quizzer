import * as Redux from 'redux';
import quizMasterAPI from './quizMasterAPI'
// import initialFrontPageData from './frontPageData';
// import initialItemStatuses from './itemStatuses';

import update from 'immutability-helper';

//=====================================================================
//    State management for HN Items and their read/seen-statuses
//---------------------------------------------------------------------
const quizMasterState = {
    id: 0,
    username: "Mark",
    password: "Hoi",
};

export function loginAction(username, password) {
    console.log(username);
    return {type: "loginAction", username, password};
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

function loginReducer(state = quizMasterState, action) {
    switch (action.type) {

        case 'loginAction': {
                quizMasterAPI.getLogin(action.username, action.password, (err, nothing) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let update = {
                            'id': nothing._id
                        };

                        return copyAndUpdateObj(state, update);

                    }
                });


            }
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
        case 'logout': {
            let update = {
                'id': 0
            };
            console.log(copyAndUpdateObj(state, update));
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
    quizMaster: loginReducer,
});