import {
  LOADING,
} from '../constants/index';

const isLoading = (state = false, action = {}) => {
  switch (action.type) {
    case LOADING:
      return action.status;
    default: return state;
  }
};

export default {
  isLoading
};
