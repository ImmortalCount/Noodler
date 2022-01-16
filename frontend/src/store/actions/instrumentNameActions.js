import { INSTRUMENT_NAME_SET_FAIL, INSTRUMENT_NAME_SET_SUCCESS } from "../constants/instrumentNameConstants"

export const setInstrumentNames = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: INSTRUMENT_NAME_SET_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: INSTRUMENT_NAME_SET_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        })
    }
}