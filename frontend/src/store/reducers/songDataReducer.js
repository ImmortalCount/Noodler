import { SONG_DATA_INITIALIZE, SONG_DATA_SET_FAIL, SONG_DATA_SET_SUCCESS } from "../constants/songDataConstants";

export const songDataReducer = (state = {}, action) => {
    switch (action.type){
        case SONG_DATA_SET_SUCCESS:
            return {songInfo: action.payload}
        case SONG_DATA_SET_FAIL:
            return {error: action.payload}
        case SONG_DATA_INITIALIZE:
            return {}
        default:
            return state
    }
}