import { SET_TAB_FAIL, SET_TAB_INITIALIZE, SET_TAB_SUCCESS } from "../constants/tabConstants"

export const tabReducer =  (state = {}, action) => {
    switch (action.type){
        case SET_TAB_SUCCESS:
            return {tab: action.payload}
        case SET_TAB_FAIL:
            return {error: action.payload}
        case SET_TAB_INITIALIZE:
            return {}
        default: 
            return state
    }
}