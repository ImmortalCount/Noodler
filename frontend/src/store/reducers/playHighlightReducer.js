import { SET_PLAY_HIGHLIGHT_FAILURE, SET_PLAY_HIGHLIGHT_INITIALIZE, SET_PLAY_HIGHLIGHT_SUCCESS } from "../constants/PlayHighlightConstants"


export const playHighlightReducer =  (state = {}, action) => {
    switch (action.type){
        case SET_PLAY_HIGHLIGHT_SUCCESS:
            return {playHighlight: action.payload}
        case SET_PLAY_HIGHLIGHT_FAILURE:
            return {error: action.payload}
        case SET_PLAY_HIGHLIGHT_INITIALIZE:
            return {}
        default: 
            return state
    }
}