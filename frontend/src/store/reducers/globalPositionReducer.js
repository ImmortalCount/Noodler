import { SET_GLOBAL_POSITION_FAIL, SET_GLOBAL_POSITION_INITIALIZE, SET_GLOBAL_POSITION_SUCCESS } from "../constants/globalPositionConstants"

const initialstate = {globalPosition: 0}
export const globalPositionReducer =  (state = initialstate, action) => {
    switch (action.type){
        case SET_GLOBAL_POSITION_SUCCESS:
            return {globalPosition: action.payload}
        case SET_GLOBAL_POSITION_FAIL:
            return {error: action.payload}
        case SET_GLOBAL_POSITION_INITIALIZE:
            return {}
        default: 
            return state
    }
}