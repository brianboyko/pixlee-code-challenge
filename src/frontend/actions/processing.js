import {
  SET_PROCESSING
} from '../constants/index';

export const setProcessing = (statusBool) => ({
  type: SET_PROCESSING,
  status: statusBool,
});
