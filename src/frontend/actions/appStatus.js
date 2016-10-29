import {
  LOADING, OPEN_DRAWER, CLOSE_DRAWER, TOGGLE_DRAWER
} from '../constants/index';

const setLoading = (status) => ({
  type: LOADING,
  status
});

const openDrawer = () => ({
  type: OPEN_DRAWER,
});

const closeDrawer = () => ({
  type: CLOSE_DRAWER,
});

const toggleDrawer = () => ({
  type: TOGGLE_DRAWER,
});


export default {
  setLoading,
  openDrawer,
  closeDrawer,
  toggleDrawer,
};
