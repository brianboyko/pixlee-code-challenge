// ==========================
// ./reducers/index.js
// ==========================

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import appStatus from './appStatus';
import images from './images';

const appReducer = combineReducers(Object.assign({}, { routing: routerReducer }, appStatus, images));

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
