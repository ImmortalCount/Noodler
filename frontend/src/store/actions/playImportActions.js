
import { PLAY_IMPORT_SET_FAIL, PLAY_IMPORT_SET_SUCCESS } from "../constants/playImportConstants";

export const setPlayImport = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: PLAY_IMPORT_SET_SUCCESS,
            payload: dataObj,
        })
    } catch (error){
        dispatch({
            type: PLAY_IMPORT_SET_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}