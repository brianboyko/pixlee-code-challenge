'use strict';
import request from 'request';
import moment from 'moment';

const ITOKEN = '272855367.b6f7db4.27aee70b486a4fd7b1b5546c1da0453d';
const INSTAGRAM_URL = 'https://api.instagram.com/v1/tags/';
const REQ_LIMIT = 450;
const HOUR = 3600000;

let currentLoad = 1; // this is going to be a system-level variable eventually that we will get from the server.

/**
 * throttle - delays the execution of a function.
 * @param  {Function} fn   a function
 * @param  {array}   args - that function's argument
 * @return {Promise}
 *   @resolves fn(args);
 */
const throttle = (fn, args) => new Promise(function(resolve) {
  setTimeout(() => {
    resolve(fn.apply(null, args));
  }, HOUR / (REQ_LIMIT * currentLoad));
});


/**
 * getFromIGByTag - gets the latest from Instagram, based on a tag.
 * @param  {string} tagName
 * @return {Promise}
 *   @resolves {object} - data from the Instagram API
 *   @rejects {error}
 */
const getFromIGByTag = (tagName) => new Promise(function(resolve, reject) {
  request.get({
    url: INSTAGRAM_URL + tagName + '/media/recent',
    qs: {
      access_token: ITOKEN
    }
  }, (err, response, body) => {
    if (err) {
      reject(err);
    } else {
      resolve(JSON.parse(body));
    }
  });
});


/**
 * getFromFullURL - gets the next page of data from instagram based on a URL.
 * @param  {string} fullURL - the next URL in instagram's pagination.
 * @return {Promise}
 *   @resolves {object} - data from the Instagram API
 *   @rejects {error}
 *     if we've used up our Instagram token, we get this err:
 *     err in getFromFullURL:  { [Error: read ECONNRESET] code: 'ECONNRESET', errno: 'ECONNRESET', syscall: 'read' }
 */
const getFromFullURL = (fullURL) => new Promise(function(resolve, reject) {
  request.get(fullURL, (err, response, body) => {
    if (err) {
      reject(err);
    } else {
      resolve(JSON.parse(body));
    }
  });
});

/**
 * consolidate - consolidates two responses from the API into one bundle.
 * @param  {object} firstData
 * @param  {object} nextData
 * @return {object} - contains all the data of the first and next page in the API.
 */
const consolidate = (firstData, nextData) => {
  let smushObj = firstData;
  smushObj.pagination.next_max_id = nextData.pagination.next_max_id;
  smushObj.pagination.next_url = nextData.pagination.next_url;
  smushObj.data = firstData.data.concat(nextData.data);
  return smushObj;
};

/**
 * getTagData grabs the initial data from the Instagram APi for a particular tag.
 * @param  {string} tagName
 * @return {Promise}
 *   @resolves {object} - data from Instagram
 *   @rejects {error}
 */
const getTagData = (tagName) => new Promise(function(resolve, reject) {
  request.get({
    url: INSTAGRAM_URL + tagName,
    qs: {
      access_token: ITOKEN
    }
  }, (err, response, body) => {
    if (err) {
      reject(err);
    } else {
      resolve(JSON.parse(body));
    }
  });
});

/**
 * getThisManyPhotos -- DEPRECIATED
 * As part of the research into the project, this was used to
 * see if I could chain together requests to get a fixed number of
 * photos. This is effectively dead code but might be useful in the future,
 * especially if one is to grab, say, 100 photos unthrottled, followed by
 * a throttled request for the next 100.
 * @param  {Number}  numPhotos - the number of photos to grab
 * @param  {string}  tagName
 * @param  {object or undefined} previous - the results we have so far.
 * @param  {Boolean} [isThrottled=false]
 * @return {Promise}
 *   @resolves {object} - data from Instagram
 *   @rejects {error}
 */
const getThisManyPhotos = (numPhotos, tagName, previous, isThrottled = false) => new Promise((resolve, reject) => {
  let getInit = isThrottled ? (...args) => throttle(getFromIGByTag, args) : getFromIGByTag;
  let getNext = isThrottled ? (...args) => throttle(getFromFullURL, args) : getFromFullURL;
  if (!previous) {
    getInit(tagName).then((igResp) => {
      if (igResp.data.length >= numPhotos || igResp.data.length < 20) {
        resolve(igResp);
      } else {
        resolve(getThisManyPhotos(numPhotos, tagName, igResp, isThrottled));
      }
    }).catch((err) => {
      reject(err)
    });
  } else {
    getNext(previous.pagination.next_url).then((igResp) => {
      let bundle = consolidate(previous, igResp);
      if (bundle.data.length >= numPhotos || igResp.data.length === 0) {
        resolve(bundle);
      } else {
        resolve(getThisManyPhotos(numPhotos, tagName, bundle, isThrottled));
      }
    }).catch((err) => {
      reject(err)
    });
  }
});

  /**
   * getPhotosInDateRange - gets the photos in the date range.
   * @param  {string}  tagName
   * @param  {Moment}  startDate
   * @param  {Moment}  endDate
   * @param  {Boolean} [isThrottled=false]
   * @return {function} recGetPhotos (which returns a promise which resolves photos from IG)
   */
  const getPhotosInDateRange = (tagName, { startDate, endDate }, isThrottled = false) => {
    // throttle the functions if we need to.
    let getInit = isThrottled ? (...args) => throttle(getFromIGByTag, args) : getFromIGByTag;
    let getNext = isThrottled ? (...args) => throttle(getFromFullURL, args) : getFromFullURL;

    /**
     * recGetPhotos is a recursive function which has been declared here so that we
     * can use getInit and getNext as the throttled or unthrottled versions of the functions
     * through closure.
     * @param  {object or undefined} prev - the previous bit of the bundle.
     * @return {Promise}
     *   @resolves {object} - photos from instagram
     *   @rejects {error}
     */
    const recGetPhotos = (prev) => new Promise(function(resolve, reject) {
      if (!prev) {
        getInit(tagName).then((igResp) => {
          if (igResp.data[igResp.data.length - 1].created_time <= startDate || igResp.data.length < 20) {
            console.log("done once");
            resolve(igResp);
            return;
          } else {
            resolve(recGetPhotos(igResp));
          }
        }).catch((err) => reject(err));
      } else {
        getNext(prev.pagination.next_url).then((igResp) => {
          let bundle = consolidate(prev, igResp);
          if (bundle.data[bundle.data.length - 1].created_time <= startDate || bundle.data.length > 20) {
            console.log('done bundle')
            resolve(bundle);
          } else {
            resolve(recGetPhotos(bundle));
          }
        }).catch((err) => reject(err));
      }
    });

    return recGetPhotos();

  };

export default {
  getFromIGByTag,
  getFromFullURL,
  getTagData,
  getThisManyPhotos,
  getPhotosInDateRange,
  throttled: {
    getFromIGByTag: (...args) => throttle(getFromIGByTag, args),
    getFromFullURL: (...args) => throttle(getFromFullURL, args),
    getTagData: (...args) => throttle(getTagData, args),
    getThisManyPhotos: (numPhotos, tagName, previous) => getThisManyPhotos(numPhotos, tagName, previous, true),
    getPhotosInDateRange: (tagName, { startDate, endDate }) =>
      getPhotosInDateRange(tagName, { startDate, endDate }, true),
  }
};
