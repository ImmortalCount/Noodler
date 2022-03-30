import { NOTE_DISPLAY_FAIL, NOTE_DISPLAY_INITIALIZE, NOTE_DISPLAY_SUCCESS } from "../constants/noteDisplayConstants"

export const noteDisplayReducer =  (state = {}, action) => {
    switch (action.type){
        case NOTE_DISPLAY_SUCCESS:
            return {noteDisplay: action.payload}
        case NOTE_DISPLAY_FAIL:
            return {error: action.payload}
        case NOTE_DISPLAY_INITIALIZE:
            return {}
        default: 
            return state
    }
}