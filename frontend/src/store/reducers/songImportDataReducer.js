// import { SONG_DATA_INITIALIZE, SONG_DATA_SET_FAIL, SONG_DATA_SET_SUCCESS } from "../constants/songDataConstants";

import { SONG_IMPORT_DATA_FAIL, SONG_IMPORT_DATA_INITIALIZE, SONG_IMPORT_DATA_SUCCESS } from "../constants/songImportDataConstants"

export const songImportDataReducer =  (state = {}, action) => {
    switch (action.type){
        case SONG_IMPORT_DATA_SUCCESS:
            return {songImport: action.payload}
        case SONG_IMPORT_DATA_FAIL:
            return {error: action.payload}
        case SONG_IMPORT_DATA_INITIALIZE:
            return {}
        default: 
            return state
    }
}