'use strict';
import request from 'request';

import {
  LOAD_IMAGES,
  CONCAT_IMAGES,
  CLEAR_IMAGES,
} from '../constants/index';

import AppStatus from './appStatus';

const setLoading = AppStatus.setLoading;

const loadImages = (images) => ({
  type: LOAD_IMAGES,
  images,
});

const concatImages = (images) => ({
  type: CONCAT_IMAGES,
  images,
});

const clearImages = () => ({
  type: CLEAR_IMAGES,
});

const getLatest = (tagName) => new Promise((resolve, reject) => {
  request.get({
    url: `${process.env.ROOT_URL}/api/getLatest/${tagName}`,
    withCredentials: false,
    headers: {
      "Access-Control-Allow-Credentials": false,
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Methods": 'GET,PUT,POST,DELETE',
      "Content-Type": "application/json",
      "Accept": "*/*",
    }
  }, (err, response, body) => {
    if (err) {
      reject(err);
    } else {
      resolve(JSON.parse(body));
    }
  });
});

const getImagesByTag = (tagName) => (dispatch) => {
  dispatch(setLoading(true));
  return getLatest(tagName)
    .then(images => dispatch(loadImages(images.data)))
    .then(() => dispatch(setLoading(false)));
};

export default {
  loadImages,
  concatImages,
  clearImages,
  getImagesByTag,
};
