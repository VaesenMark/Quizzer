import * as Redux from 'redux';

import initialFrontPageData from './frontpageData';
import itemsAPI from './itemsAPI'
import initialItemStatuses from './itemStatuses';
import getState from "redux/es/createStore";


//===========================================================================
//  Some functions that help to create new copied versions of state,
//  instead of mutating existing objects or arrays
//---------------------------------------------------------------------------

// Create a swallow copy of an object
function copyObj(copiedObject) {
    return Object.assign({}, copiedObject);
}
// Create a shallow copy of an object, and then copy all fields from
// 'update'-object into the copied object (changing/overwriting fields if needed)
function copyAndUpdateObj(copiedObject, update) {
    return Object.assign({}, copiedObject, update);
}

// Create a swallow copy of an array
function copyArr(array) {
    return array.slice(0, array.length);
}
// Create a swallow copy of an array, and change a single value in the result.
function copyAndUpdateArr(array, index, value) {
    let result = arr.slice(0, array.length);
    result[index] = value;
    return result;
}
// Create a swallow copy of an array, and append a value to the end of the result.
function copyAndPushArr(array, value) {
    let result = arr.slice(0, array.length);
    result.push(value);
    return result;
}


//=====================================================================
//    State management for HN Items and their read/seen-statuses
//---------------------------------------------------------------------

// Action Creators:

export function markAsSeenAction(state) {
    for(let i = 0; i < getState().prefs.currentListSize; i++) {
        itemsAPI.getAllItems( (err, nothing) => {
            if(err) {
                dispatch({ type: 'errorGetAllItems', success:false });
            } else {
                dispatch({ type: 'successGetAllItems', success:true, items });
            }
        });
    }
    return {type: "markAsSeenAction", listSize};
    // getState();
    // For loop en update waarde op server en lokaal state. Hier omdat er geen api call in de reducer mag
}
export function toggleItemAction(item) {
    return {type: "toggleItemAction", item};
}

export function fetchItems() {
    return (dispatch) => {
        dispatch({ type: 'startGetAllItems' });
        itemsAPI.getAllItems( (err, items) => {
            if(err) {
                dispatch({ type: 'errorGetAllItems', success:false });
            } else {
                dispatch({ type: 'successGetAllItems', success:true, items });
            }
        });
    };
}

// Reducer:

const initialHNItemsState = {
    items: null,
    selectedItem: null,
    statuses: initialItemStatuses,
}

function hnItemsReducer(state = initialHNItemsState, action) {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.
    switch (action.type) {

        case 'toggleItemAction':
            if (state.selectedItem) {
                if (action.item.id === state.selectedItem.id) {
                    return copyAndUpdateObj(state, {selectedItem: null});
                }
            }
            let newStatuses = copyAndUpdateObj(state.statuses, {[action.item.id]: "read"});
            return copyAndUpdateObj(state, {
                selectedItem: action.item,
                statuses: newStatuses
            })

        case 'markAsSeenAction':
            newStatuses = copyObj(state.statuses);
            if (state.items) {
                state.items.forEach((itm, idx) => {
                    if (idx < action.listSize && state.statuses[itm.id] == undefined) {
                        newStatuses[itm.id] = "seen";
                    }
                });
            }
            return copyAndUpdateObj(state, {statuses: newStatuses});

        case 'startGetAllItems':
            newStatuses = copyObj(state.statuses);
            return copyAndUpdateObj(state, {statuses: newStatuses});

        case 'errorGetAllItems':
            newStatuses = copyObj(state.statuses);
            return copyAndUpdateObj(state, {statuses: newStatuses});

        case 'successGetAllItems':
            newStatuses = copyObj(state.statuses);
            return copyAndUpdateObj(state, {
                items: action.items
            });

        default:
            return state;
    }
}


//=====================================================================
//    State management for the Preferences
//---------------------------------------------------------------------

// Action Creators:

export function showPrefsAction() {
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
    editingListSize: 42,
    currentColor: "orange",
    currentListSize: 42
}

function preferencesReducer(state = initialPreferencesState, action) {
    // Note how all branches of the switch-statement always return
    // (a new version of) the state. Reducers must always return a (new) state.
    switch (action.type) {

        case 'showPrefsAction': {
            let changes = {
                showingPrefs: true,
                editingColor: state.currentColor,
                editingListSize: state.currentListSize
            };
            return copyAndUpdateObj(state, changes);
        }
        case 'closePrefsAction': {
            let changes = {
                showingPrefs: false
            };
            return copyAndUpdateObj(state, changes);
        }
        case 'editColorAction': {
            let changes = {
                editingColor: action.selectedColor
            };
            return copyAndUpdateObj(state, changes);
        }
        case 'closeAndApplyPrefsAction': {
            let changes = {
                currentColor: state.editingColor,
                currentListSize: state.editingListSize,
                showingPrefs: false
            };
            return copyAndUpdateObj(state, changes);
        }
        case 'editListSizeAction': {
            let changes = {
                editingListSize: action.itemCount
            };
            return copyAndUpdateObj(state, changes);
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
