
import { SONG_IMPORT_DATA_FAIL, SONG_IMPORT_DATA_SUCCESS } from "../constants/songImportDataConstants"

export const setSongImportData = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SONG_IMPORT_DATA_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: SONG_IMPORT_DATA_FAIL,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}