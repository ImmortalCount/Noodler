import { combineReducers } from "redux";
import moduleDataReducer from './moduleDataReducer.js';

const reducers = combineReducers({
    module: moduleDataReducer
})

export default reducers