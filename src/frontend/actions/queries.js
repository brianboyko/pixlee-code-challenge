import {
  LOADING,
  SET_MODE,
  ADD_QUERY,
  REMOVE_QUERY,
  COMPLETE_QUERY,
  HYDRATE
} from '../constants/index';

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
