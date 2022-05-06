import { MAP_CHORDS_TO_PLAYER_FAIL, MAP_CHORDS_TO_PLAYER_SUCCESS } from "../constants/mapChordsToPlayerConstants"

export const mapChordsToPlayer = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: MAP_CHORDS_TO_PLAYER_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: MAP_CHORDS_TO_PLAYER_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}