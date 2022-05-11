
import { SET_DISPLAY_FOCUS_FAIL, SET_DISPLAY_FOCUS_SUCCESS } from "../constants/displayFocusConstants"

export const setDisplayFocus = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SET_DISPLAY_FOCUS_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: SET_DISPLAY_FOCUS_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}