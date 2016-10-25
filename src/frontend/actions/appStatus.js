import {
  LOADING,
} from '../constants/index';

const setLoading = (status) => ({
  type: LOADING,
  status
});

export default {
  setLoading,
};
