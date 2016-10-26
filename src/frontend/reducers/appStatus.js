import {
  LOADING, SET_MODE, HYDRATE,
} from '../constants/index';

const isLoading = (state = false, action = {}) => {
  switch (action.type) {
    case LOADING:
      return action.status;
    case HYDRATE:
      return action.isLoading ? action.isLoading : state;
    default: return state;
  }
};

const mode = (state = "latest", action = {}) => {
  switch(action.type){
    case SET_MODE:
      return action.mode;
    case HYDRATE:
      return action.mode ? action.mode : state;
    default: return state;
  }
};

export default {
  isLoading,
  mode
};
