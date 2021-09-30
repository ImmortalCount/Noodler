import { combineReducers } from "redux";
import moduleDataReducer from './moduleDataReducer.js';
import scaleDataReducer from './scaleDataReducer.js';

const reducers = combineReducers({
    module: moduleDataReducer,
    scale: scaleDataReducer
})

export default reducers