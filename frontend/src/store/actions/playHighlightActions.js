import { SET_PLAY_HIGHLIGHT_FAILURE, SET_PLAY_HIGHLIGHT_SUCCESS } from "../constants/PlayHighlightConstants"


export const setPlayHighlight = (dataObj) => async (dispatch) => {
    try {
        dispatch({
            type: SET_PLAY_HIGHLIGHT_SUCCESS,
            payload: dataObj
        })
    } catch (error){
        dispatch({
            type: SET_PLAY_HIGHLIGHT_FAILURE,
            payload: error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        })
    }
}