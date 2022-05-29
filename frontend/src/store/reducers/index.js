import { combineReducers } from "redux";
import { dataInsertReducer, dataListReducer, dataUpdateReducer } from "./dataPoolReducer.js";
import moduleDataReducer from './moduleDataReducer.js';
import scaleDataReducer from './scaleDataReducer.js';
import { userLoginReducer, userRegisterReducer } from "./userReducers.js";
import { labDataReducer } from "./labDataReducer.js";
import { songDataReducer } from "./songDataReducer.js";
import { songImportDataReducer } from "./songImportDataReducer.js";
import { instrumentNameReducer } from "./instrumentNameReducer.js";
import {noteDisplayReducer} from './noteDisplayReducer.js'
import { playImportReducer } from "./playImportReducer.js";
import { playHighlightReducer } from "./playHighlightReducer.js";
import { mapChordsToPlayerReducer } from "./mapChordsToPlayerReducer.js";
import { globalInstrumentsReducer } from "./globalInstrumentsReducer.js";
import { mixerReducer } from "./mixerReducer.js";
import { tabReducer } from './tabReducer.js';
import { displayFocusReducer } from "./displayFocusReducer.js";
import { globalPositionReducer } from "./globalPositionReducer.js";
import { setBpmReducer } from "./setBpmReducer.js";

const reducers = combineReducers({
    module: moduleDataReducer,
    scale: scaleDataReducer,
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    dataList: dataListReducer,
    labData: labDataReducer,
    songData: songDataReducer,
    songImport: songImportDataReducer,
    instrumentNames: instrumentNameReducer,
    dataInsert: dataInsertReducer,
    dataUpdate: dataUpdateReducer,
    noteDisplay: noteDisplayReducer,
    playImport: playImportReducer,
    playHighlight: playHighlightReducer,
    mapChordsToPlayer: mapChordsToPlayerReducer,
    globalInstruments: globalInstrumentsReducer,
    mixer: mixerReducer,
    tab: tabReducer,
    displayFocus: displayFocusReducer,
    globalPosition: globalPositionReducer,
    setBpm: setBpmReducer
})

export default reducers