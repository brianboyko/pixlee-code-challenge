import request from 'request';
import moment from 'moment';

const ITOKEN = '272855367.b6f7db4.27aee70b486a4fd7b1b5546c1da0453d';
const ROOT_URL = 'https://api.instagram.com/v1/tags/';
const REQ_LIMIT = 450;
const HOUR = 3600000;

let currentLoad = 1; // this is going to be a system-level variable eventually that we will get from the server.

const throttle = (fn, args) => new Promise(function(resolve) {
  setTimeout(() => {
    resolve(fn.apply(null, args));
  }, HOUR / (REQ_LIMIT * currentLoad));
});



const getFromIGByTag = (tagName) => new Promise(function(resolve, reject) {
  request.get({
    url: ROOT_URL + tagName + '/media/recent',
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


const getFromFullURL = (fullURL) => new Promise(function(resolve, reject) {
  request.get(fullURL, (err, response, body) => {
    if (err) {
      reject(err);
    } else {
      resolve(JSON.parse(body));
    }
  });
});

const consolidate = (firstData, nextData) => {
  let smushObj = firstData;
  smushObj.pagination.next_max_id = nextData.pagination.next_max_id;
  smushObj.pagination.next_url = nextData.pagination.next_url;
  smushObj.data = firstData.data.concat(nextData.data);
  return smushObj;
};

const getTagData = (tagName) => new Promise(function(resolve, reject) {
  request.get({
    url: ROOT_URL + tagName,
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
    }).catch((err) => reject(err));
  } else {
    getNext(previous.pagination.next_url).then((igResp) => {
      let bundle = consolidate(previous, igResp);
      if (bundle.data.length >= numPhotos || igResp.data.length === 0) {
        resolve(bundle);
      } else {
        resolve(getThisManyPhotos(numPhotos, tagName, bundle, isThrottled));
      }
    }).catch((err) => reject(err));
  }
});


const estimateNumberOfRequestsNeeded = (tagName, { startDate, endDate }, isThrottled = false) =>
  new Promise(function(resolve, reject) {
    let getData = isThrottled ? (...args) => throttle(getTagData, args) : getTagData;
    let getMany = isThrottled ?
      (numPhotos, tagName, previous) => getThisManyPhotos(numPhotos, tagName, previous, true) :
      getThisManyPhotos;
      Promise.all([
        getData(tagName),
        getMany(100, tagName)
      ])
      .then((v) => ({ tagData: v[0], last100Photos: v[1] }))
      .then(({ tagData, last100Photos }) => {
        let number = last100Photos.data.length;
        if (number < 100) {
          resolve(Math.ceil(number / 20));
        } else {
          let latest = last100Photos.data[0].created_time;
          let oldest = last100Photos.data[last100Photos.data.length - 1].created_time;
          let timespan = (latest - oldest) / 5;
          let timeLength = Date.now() - startDate;
          resolve(Math.ceil(timeLength / timespan));
        }
      })
      .catch((err) => reject(err));
    });

  const getPhotosInDateRange = (tagName, { startDate, endDate }, isThrottled = false) => {
    console.log("getPhotosInDateRange is running", tagName, startDate, endDate)
    // don't run this if there's no change in the date.
    if (startDate === endDate){
      return null;
    }
    // the start date is the EARLIEST point in time. This prevents infinite loops
    // especially when testing with Postman.
    if (startDate > endDate){
      let temp = endDate;
      endDate = startDate,
      startDate = temp;
    }

    // throttle the functions if we need to.
    let getInit = isThrottled ? (...args) => throttle(getFromIGByTag, args) : getFromIGByTag;
    let getNext = isThrottled ? (...args) => throttle(getFromFullURL, args) : getFromFullURL;

    const recGetPhotos = (prev) => new Promise(function(resolve, reject) {
      console.log(". " + prev ? prev.data.length : 0);
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
          if (bundle.data[bundle.data.length - 1].created_time <= startDate || bundle.data.length === 0) {
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


const estimateTimeForRequest = (tagName, { startDate, endDate }) => new Promise(function(resolve, reject) {
  estimateNumberOfRequestsNeeded(tagName, { startDate, endDate }, true).then((numReq) => {
      return (HOUR * numReq) / (REQ_LIMIT * currentLoad);
    })
    .then((milliseconds) => resolve(moment.duration(milliseconds))).catch((err) => reject(err));
});

export default {
  getFromIGByTag,
  getFromFullURL,
  getTagData,
  getThisManyPhotos,
  estimateNumberOfRequestsNeeded,
  getPhotosInDateRange,
  throttled: {
    estimateTimeForRequest,
    getFromIGByTag: (...args) => throttle(getFromIGByTag, args),
    getFromFullURL: (...args) => throttle(getFromFullURL, args),
    getTagData: (...args) => throttle(getTagData, args),
    getThisManyPhotos: (numPhotos, tagName, previous) => getThisManyPhotos(numPhotos, tagName, previous, true),
    estimateNumberOfRequestsNeeded: (tagName, { startDate, endDate }) =>
      estimateNumberOfRequestsNeeded(tagName, { startDate, endDate }, true),
    getPhotosInDateRange: (tagName, { startDate, endDate }) =>
      getPhotosInDateRange(tagName, { startDate, endDate }, true),
  }
};
