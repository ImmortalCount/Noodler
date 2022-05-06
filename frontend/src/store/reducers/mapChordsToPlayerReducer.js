import { MAP_CHORDS_TO_PLAYER_FAIL, MAP_CHORDS_TO_PLAYER_INITIALIZE, MAP_CHORDS_TO_PLAYER_SUCCESS } from "../constants/mapChordsToPlayerConstants"

export const mapChordsToPlayerReducer =  (state = {}, action) => {
    switch (action.type){
        case MAP_CHORDS_TO_PLAYER_SUCCESS:
            return {mapChordsToPlayer: action.payload}
        case MAP_CHORDS_TO_PLAYER_FAIL:
            return {error: action.payload}
        case MAP_CHORDS_TO_PLAYER_INITIALIZE:
            return {}
        default: 
            return state
    }
}