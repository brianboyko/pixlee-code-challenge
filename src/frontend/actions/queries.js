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

const insertQuery = (tagName, startDate, endDate) => {

};


const addQuery = (query) => ({
  type: ADD_QUERY,
  query,
});

const removeQuery = (id) => ({
  type: REMOVE_QUERY,
  id,
});

const completeQuery = (id) => ({
  type: COMPLETE_QUERY,
  id
});

const setMinDate = (date) => ({
  type: SET_MIN_DATE,
  date,
});

const setMaxDate = (date) => ({
  type: SET_MAX_DATE,
  date,
});

export default {
  addQuery,
  removeQuery,
  completeQuery,
  setMinDate,
  setMaxDate,
};
