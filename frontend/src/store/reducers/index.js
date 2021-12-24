import { combineReducers } from "redux";
import { dataListReducer } from "./dataPoolReducer.js";
import moduleDataReducer from './moduleDataReducer.js';
import scaleDataReducer from './scaleDataReducer.js';
import { userLoginReducer, userRegisterReducer } from "./userReducers.js";
import { labDataReducer } from "./labDataReducer.js";

const reducers = combineReducers({
    module: moduleDataReducer,
    scale: scaleDataReducer,
    userRegister: userRegisterReducer,
    userLogin: userLoginReducer,
    dataList: dataListReducer,
    labData: labDataReducer
})

export default reducers