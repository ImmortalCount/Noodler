import { SET_GLOBAL_INSTRUMENTS_FAIL, SET_GLOBAL_INSTRUMENTS_SUCCESS } from "../constants/globalInstrumentsConstants"

export const setGlobalInstruments = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SET_GLOBAL_INSTRUMENTS_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: SET_GLOBAL_INSTRUMENTS_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}