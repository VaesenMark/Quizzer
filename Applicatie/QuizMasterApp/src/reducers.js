import * as Redux from 'redux';
import quizMasterAPI from './quizMasterAPI'
// import initialFrontPageData from './frontPageData';
// import initialItemStatuses from './itemStatuses';

import update from 'immutability-helper';

//=====================================================================
//    State management for HN Items and their read/seen-statuses
//---------------------------------------------------------------------
const loginState = {
    id: null,
    teamname: "",
    score: 0
};
export function loginAction(item) {
    return {type: "loginAction", item};
}


function loginReducer(state = loginState, action) {
    switch (action.type) {

        case 'loginAction': {
            if (state.id == null) {
                var test = quizMasterAPI.getLogin("denn", "denn");
                var update = {
                    "id": 5,
                    "teamname": "Mankey's",
                    "score": 3
                }
            }
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
    login: loginReducer,
});