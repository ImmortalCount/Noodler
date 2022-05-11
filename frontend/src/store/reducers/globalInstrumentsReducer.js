import { SET_GLOBAL_INSTRUMENTS_FAIL, SET_GLOBAL_INSTRUMENTS_INITIALIZE, SET_GLOBAL_INSTRUMENTS_SUCCESS } from "../constants/globalInstrumentsConstants"

const initialstate = {globalInstruments: [
    {
        "name": "Instr 1",
        "instrument": "acoustic_guitar_nylon",
        "synthSource": "acoustic_guitar_nylon",
        "type": "guitar",
        "noteColors": "",
        "scale": [],
        "tuning": [
            "E4",
            "B3",
            "G3",
            "D3",
            "A2",
            "E2"
        ],
        "stringNumber": 6,
        "fretNumber": 24
    }
]}
export const globalInstrumentsReducer =  (state = initialstate, action) => {
    switch (action.type){
        case SET_GLOBAL_INSTRUMENTS_SUCCESS:
            return {globalInstruments: action.payload}
        case SET_GLOBAL_INSTRUMENTS_FAIL:
            return {error: action.payload}
        case SET_GLOBAL_INSTRUMENTS_INITIALIZE:
            return {}
        default: 
            return state
    }
}