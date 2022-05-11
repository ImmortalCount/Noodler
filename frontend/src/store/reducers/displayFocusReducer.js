import { SET_DISPLAY_FOCUS_FAIL, SET_DISPLAY_FOCUS_INITIALIZE, SET_DISPLAY_FOCUS_SUCCESS } from "../constants/displayFocusConstants"

export const displayFocusReducer =  (state = {displayFocus:'player'}, action) => {
    switch (action.type){
        case SET_DISPLAY_FOCUS_SUCCESS:
            return {displayFocus: action.payload}
        case SET_DISPLAY_FOCUS_FAIL:
            return {error: action.payload}
        case SET_DISPLAY_FOCUS_INITIALIZE:
            return {}
        default: 
            return state
    }
}