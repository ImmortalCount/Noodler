import { SET_GLOBAL_INSTRUMENTS_FAIL, SET_GLOBAL_INSTRUMENTS_INITIALIZE, SET_GLOBAL_INSTRUMENTS_SUCCESS } from "../constants/globalInstrumentsConstants"

export const globalInstrumentsReducer =  (state = {}, action) => {
    switch (action.type){
        case SET_GLOBAL_INSTRUMENTS_SUCCESS:
            return {globalInstruments: action.payload}
        case SET_GLOBAL_INSTRUMENTS_FAIL:
            return {error: action.payload}
        case SET_GLOBAL_INSTRUMENTS_INITIALIZE:
            return {}
        default: 
            return state
    }
}