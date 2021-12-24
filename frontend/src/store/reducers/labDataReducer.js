import {
    LAB_DATA_SET_SUCCESS,
    LAB_DATA_SET_FAIL,
    LAB_DATA_INITIALIZE
} from '../constants/labDataConstants.js'

export const labDataReducer = (state = {}, action) => {
    switch (action.type){
        case LAB_DATA_SET_SUCCESS:
            return {labInfo: action.payload}
        case LAB_DATA_SET_FAIL:
            return {error: action.payload}
        case LAB_DATA_INITIALIZE: 
            return {}
        default:
            return state
    }
}