import { SET_BPM_FAILURE, SET_BPM_INITIALIZE, SET_BPM_SUCCESS } from "../constants/setBpmConstants"

export const setBpmReducer =  (state = {bpm: '120'}, action) => {
    switch (action.type){
        case SET_BPM_SUCCESS:
            return {bpm: action.payload}
        case SET_BPM_FAILURE:
            return {error: action.payload}
        case SET_BPM_INITIALIZE:
            return {}
        default: 
            return state
    }
}