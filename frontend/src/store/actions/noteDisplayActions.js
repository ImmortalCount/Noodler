import { NOTE_DISPLAY_FAIL, NOTE_DISPLAY_SUCCESS } from "../constants/noteDisplayConstants"

export const setNoteDisplay = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: NOTE_DISPLAY_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: NOTE_DISPLAY_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}