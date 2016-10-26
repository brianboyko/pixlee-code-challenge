import {
  LOAD_IMAGES,
  CONCAT_IMAGES,
  CLEAR_IMAGES,
  HYDRATE,
} from '../constants/index';

const images = (state = [], action = {}) => {
  switch (action.type) {
    case CLEAR_IMAGES:
      return [];
    case LOAD_IMAGES:
      return action.images;
    case CONCAT_IMAGES:
      return state.concat(action.images);
    case HYDRATE:
      return action.images ? action.images : state;
    default: return state;
  }
};

export default {
  images
};
