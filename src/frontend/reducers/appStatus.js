import {
  LOADING, SET_MODE, HYDRATE, OPEN_DRAWER, CLOSE_DRAWER, TOGGLE_DRAWER
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

const draweropen = (state = false, action = {}) => {
  switch(action.type){
    case OPEN_DRAWER:
      return true;
    case CLOSE_DRAWER:
      return false;
    case TOGGLE_DRAWER:
      return !state;
    case HYDRATE:
      return action.draweropen ? action.draweropen : state;
    default: return state;
  }
};

export default {
  isLoading,
  mode,
  draweropen,
};
