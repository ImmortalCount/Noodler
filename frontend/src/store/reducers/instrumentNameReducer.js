import { INSTRUMENT_NAME_INITIALIZE, INSTRUMENT_NAME_SET_FAIL, INSTRUMENT_NAME_SET_SUCCESS } from "../constants/instrumentNameConstants";

export const instrumentNameReducer = (state = {nameInfo: ['Instr 1']}, action) => {
    switch (action.type){
        case INSTRUMENT_NAME_SET_SUCCESS:
            return {nameInfo: action.payload}
        case INSTRUMENT_NAME_SET_FAIL:
            return {error: action.payload}
        case INSTRUMENT_NAME_INITIALIZE:
            return {}
        default: 
            return state
    }
}