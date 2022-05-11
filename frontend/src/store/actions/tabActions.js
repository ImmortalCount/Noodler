
import { SET_TAB_SUCCESS, SET_TAB_FAIL } from "../constants/tabConstants"

export const setTab = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SET_TAB_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: SET_TAB_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}