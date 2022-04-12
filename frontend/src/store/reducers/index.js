import { combineReducers } from "redux";
import { dataInsertReducer, dataListReducer } from "./dataPoolReducer.js";
import moduleDataReducer from './moduleDataReducer.js';
import scaleDataReducer from './scaleDataReducer.js';
import { userLoginReducer, userRegisterReducer } from "./userReducers.js";
import { labDataReducer } from "./labDataReducer.js";
import { songDataReducer } from "./songDataReducer.js";
import { songImportDataReducer } from "./songImportDataReducer.js";
import { instrumentNameReducer } from "./instrumentNameReducer.js";
import {noteDisplayReducer} from './noteDisplayReducer.js'
import { playImportReducer } from "./playImportReducer.js";

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
    noteDisplay: noteDisplayReducer,
    playImport: playImportReducer,
})

export default reducers