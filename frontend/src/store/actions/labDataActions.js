import { LAB_DATA_SET_FAIL, LAB_DATA_SET_SUCCESS } from "../constants/labDataConstants";

export const setLabData = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: LAB_DATA_SET_SUCCESS,
            payload: dataObj
         })
    } catch (error){
        dispatch({
            type: LAB_DATA_SET_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
         })
    }
}

