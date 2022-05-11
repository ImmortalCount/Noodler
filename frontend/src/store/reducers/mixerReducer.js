import { SET_MIXER_FAIL, SET_MIXER_INITIALIZE, SET_MIXER_SUCCESS } from "../constants/mixerConstants"

export const mixerReducer =  (state = {}, action) => {
    switch (action.type){
        case SET_MIXER_SUCCESS:
            return {mixer: action.payload}
        case SET_MIXER_FAIL:
            return {error: action.payload}
        case SET_MIXER_INITIALIZE:
            return {}
        default: 
            return state
    }
}