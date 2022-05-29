import { SET_BPM_FAILURE, SET_BPM_SUCCESS } from "../constants/setBpmConstants"

export const setBpm = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SET_BPM_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: SET_BPM_FAILURE,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}