
import { SET_MIXER_FAIL, SET_MIXER_SUCCESS } from "../constants/mixerConstants"

export const setMixer = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SET_MIXER_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: SET_MIXER_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}