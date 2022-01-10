

import { SONG_DATA_SET_FAIL, SONG_DATA_SET_SUCCESS } from "../constants/songDataConstants";

export const setSongData = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SONG_DATA_SET_SUCCESS,
            payload: dataObj
         })
    } catch (error){
        dispatch({
            type: SONG_DATA_SET_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
         })
    }
}
