import {
  LOADING,
  SET_MODE,
  ADD_QUERY,
  REMOVE_QUERY,
  COMPLETE_QUERY,
  HYDRATE,
  SET_MIN_DATE,
  SET_MAX_DATE,
} from '../constants/index';
import _ from 'lodash';

const queries = (state = [], action = {}) => {
  switch (action.type) {
    case ADD_QUERY:
      return [action.query].concat(state); //FIFO.
    case REMOVE_QUERY:
      return _.remove(state, (el) => (el.id === action.id));
    case COMPLETE_QUERY:
      let newState = state;
      let i = _.findIndex(state, (el) => (el.id === action.id));
      newState[i].completed = true;
      return newState;
    case HYDRATE:
      return action.queries ? action.queries : state;
    default:
      return state;
  }
};

const minDate = (state = null, action = {}) => {
  switch(action.type){
    case SET_MIN_DATE:
      return action.date;
    case HYDRATE:
      return action.minDate ? action.minDate : state;
    default:
      return state;
  }
};

const maxDate = (state = null, action = {}) => {
  switch(action.type){
    case SET_MAX_DATE:
      return action.date;
    case HYDRATE:
      return action.maxDate ? action.maxDate : state;
    default:
      return state;
  }
};

export default {
  queries,
  minDate,
  maxDate,
};
