import {
  LOADING,
  SET_MODE,
  ADD_QUERY,
  REMOVE_QUERY,
  COMPLETE_QUERY,
  HYDRATE
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

export default {
  addQuery,
  removeQuery,
  completeQuery,
}


// what do I need to do here?
// okay, user inputs a query.
// check the database to see if we have the file in range.
// if we do, return the files in range.
// if we don't, alert the user that we're querying.
// save files from instagram into database.
// display files from database.
