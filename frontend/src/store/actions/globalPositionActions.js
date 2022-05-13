import { SET_GLOBAL_POSITION_FAIL, SET_GLOBAL_POSITION_SUCCESS } from "../constants/globalPositionConstants"

export const setGlobalPosition = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SET_GLOBAL_POSITION_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: SET_GLOBAL_POSITION_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}