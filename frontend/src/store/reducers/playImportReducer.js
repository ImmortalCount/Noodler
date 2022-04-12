import { PLAY_IMPORT_INITIALIZE, PLAY_IMPORT_SET_FAIL, PLAY_IMPORT_SET_SUCCESS } from "../constants/playImportConstants";

export const playImportReducer = (state = {}, action) => {
    switch (action.type){
        case PLAY_IMPORT_SET_SUCCESS:
            return {playImport: action.payload}
        case PLAY_IMPORT_SET_FAIL:
            return {error: action.payload}
        case PLAY_IMPORT_INITIALIZE: 
            return {}
        default:
            return state
    }
}