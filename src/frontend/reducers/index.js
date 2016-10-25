// ==========================
// ./reducers/index.js
// ==========================

import { combineReducers } from 'redux';
import * as language from './language';
import * as currency from './currency';
import * as processing from './processing';
import { routerReducer } from 'react-router-redux';

//Should create a object with multiple function keys.
//Example: {routing: routerReducer, language: (the function exported from language.js),
//	currency: (the function exported from currency.js)}. - GMDIV
const appReducer = combineReducers(Object.assign({}, {routing: routerReducer}, language, currency, processing));

//Should apply two parameters called state and action to all functions within
//the object created in appReducer that use the parameters of state and action. - GMDIV
const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
