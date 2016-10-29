// ==========================
// ./reducers/index.js
// ==========================

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import appStatus from './appStatus';
import images from './images';
import queries from './queries';

const appReducer = combineReducers(Object.assign({}, { routing: routerReducer }, appStatus, images, queries));

const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
