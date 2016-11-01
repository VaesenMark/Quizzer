import * as Redux from 'redux';

import initialFrontPageData from './frontPageData';
import initialItemStatuses from './itemStatuses';

import update from 'immutability-helper';

//=====================================================================
//    State management for HN Items and their read/seen-statuses
//---------------------------------------------------------------------

// Action Creators:

export function markAsSeenAction(listSize) {
    return {type: "markAsSeenAction", listSize};
}
export function toggleItemAction(item) {
    return {type: "toggleItemAction", item};
}

// Reducer:

const initialHNItemsState = {
    items: initialFrontPageData,
    selectedItem: null,
    statuses: initialItemStatuses,
}

function hnItemsReducer(state = initialHNItemsState, action) {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.
    switch (action.type) {

        case 'toggleItemAction': {
            if (state.selectedItem) {
                if (action.item.id === state.selectedItem.id) {
                    return update(state, {selectedItem: {$set: null}});
                }
            }
            return update(state, {
                selectedItem: {$set: action.item},
                statuses: {[action.item.id]: {$set: "read"}}
            })
        }
        case 'markAsSeenAction': {
            let changingStatuses = {};
            state.items.forEach((itm, idx) => {
                if (idx < action.listSize && state.statuses[itm.id] == undefined) {
                    changingStatuses[itm.id] = "seen";
                }
            })
            return update(state, {statuses: {$merge: changingStatuses}});
        }
        default:
            return state;
    }
}

//=====================================================================
//    State management for the Preferences
//---------------------------------------------------------------------

// Action Creators:

export function showPrefsAction() {
    console.log('hoi');
    return {type: "showPrefsAction"};
}
export function closePrefsAction() {
    return {type: "closePrefsAction"};
}
export function closeAndApplyPrefsAction() {
    return {type: "closeAndApplyPrefsAction"};
}
export function editColorAction(selectedColor) {
    return {type: "editColorAction", selectedColor: selectedColor}
}
export function editListSizeAction(itemCount) {
    return {type: "editListSizeAction", itemCount: itemCount}
}

// Reducer:

const initialPreferencesState = {
    showingPrefs: false,
    editingColor: null,
    editingListSize: null,
    currentColor: "orange",
    currentListSize: 42
}

function preferencesReducer(state = initialPreferencesState, action) {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.
    switch (action.type) {

        case 'showPrefsAction': {
            let changes = {
                showingPrefs: {$set: true},
                editingColor: {$set: state.currentColor},
                editingListSize: {$set: state.currentListSize}
            };
            return update(state, changes);
        }
        case 'closePrefsAction': {
            let changes = {
                showingPrefs: {$set: false}
            };
            return update(state, changes);
        }
        case 'editColorAction': {
            let changes = {
                editingColor: {$set: action.selectedColor}
            };
            return update(state, changes);
        }
        case 'closeAndApplyPrefsAction': {
            let changes = {
                currentColor: {$set: state.editingColor},
                currentListSize: {$set: state.editingListSize},
                showingPrefs: {$set: false}
            };
            return update(state, changes);
        }
        case 'editListSizeAction': {
            let changes = {
                editingListSize: {$set: action.itemCount}
            };
            return update(state, changes);
        }
        default:
            return state;
    }
}

//===========================================================================
//  Combining the reducers and their state into a single reducer managing
//  a single state
//---------------------------------------------------------------------------

export const mainReducer = Redux.combineReducers({
    hnItems: hnItemsReducer,
    prefs: preferencesReducer
})
