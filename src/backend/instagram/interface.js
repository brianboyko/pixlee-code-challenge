import request from 'request'
import moment from 'moment';

const ITOKEN = '272855367.b6f7db4.27aee70b486a4fd7b1b5546c1da0453d';
const ROOT_URL = 'https://api.instagram.com/v1/tags/'
const REQ_LIMIT = 450;
const HOUR = 3600000;

const throttledAPI = (currentLoad = 1) => {

  // note. Instagram will only return 33 photos, no matter what you need.
  // This is why the recursive "get this many photos" is needed.

  const throttle = (fn, args) => new Promise(function(resolve) {
    setTimeout(() => {
      console.log("...", ...args)
      resolve(fn.apply(null, args));
    }, HOUR/(REQ_LIMIT * currentLoad));
  });

  let throttled = {}; // will add methods as we go.

  const getFromIGByTag = (tagName) => new Promise(function(resolve, reject) {
    request.get({
      url: ROOT_URL + tagName + '/media/recent',
      qs: {
        access_token: ITOKEN
      },
    }, (err, response, body) => {
      if(err){
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    })
  });

  throttled.getFromIGByTag = (...args) => throttle(getFromIGByTag, args);

  const getFromFullURL = (fullURL) => new Promise(function(resolve, reject) {
    request.get(fullURL, (err, response, body) => {
      if(err){
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    })
  });

  throttled.getFromFullURL = (...args) => throttle(getFromFullURL, args);


  const consolidate = (firstData, nextData) => {
    let smushObj = firstData;
    smushObj.pagination.next_max_id = nextData.pagination.next_max_id;
    smushObj.pagination.next_url = nextData.pagination.next_url;
    smushObj.data = firstData.data.concat(nextData.data);
    return smushObj;
  }

  const getThisManyPhotos = (numPhotos, tagName, previous) => new Promise((resolve, reject) => {
    if (!previous) {
      throttled.getFromIGByTag(tagName).then((igResp) => {
        if (igResp.data.length >= numPhotos || igResp.data.length < 20) {
          resolve(igResp);
        } else {
          resolve(throttled.getThisManyPhotos(numPhotos, tagName, igResp));
        }
      }).catch((err) => reject(err));
    } else {
      throttled.getFromFullURL(previous.pagination.next_url).then((igResp) => {
        let bundle = consolidate(previous, igResp);
        if (bundle.data.length >= numPhotos || igResp.data.length === 0) {
          resolve(bundle);
        } else {
          resolve(getThisManyPhotos(numPhotos, tagName, bundle));
        }
      }).catch((err) => reject(err));
    }
  })

  throttled.getThisManyPhotos = getThisManyPhotos;

  const getTagData = (tagName) => new Promise(function(resolve, reject) {
    request.get({
      url: ROOT_URL + tagName,
      qs: {
        access_token: ITOKEN
      },
    }, (err, response, body) => {
      if(err){
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    })
  });

  throttled.getTagData = (...args) => throttle(getTagData, args);

  const estimateNumberOfRequestsNeeded = (tagName, {startDate, endDate}) => new Promise(function(resolve, reject) {
    Promise.all([
      throttled.getTagData(tagName),
      throttled.getThisManyPhotos(100, tagName),
    ])
    .then((v) => ({tagData: v[0], last100Photos: v[1]}))
    .then(({tagData, last100Photos}) => {
      let number = last100Photos.data.length;
      if(number < 100){
        resolve(Math.ceil(number/20));
      } else{
        let latest = last100Photos.data[0].created_time;
        let oldest = last100Photos.data[last100Photos.data.length -1].created_time;
        let timespan = (latest - oldest) / 5;
        let timeLength = Date.now() - startDate;
        resolve(Math.ceil(timeLength/timespan));
      }
    })
    .catch((err) => reject(err));
  });

  throttled.estimateNumberOfRequestsNeeded = estimateNumberOfRequestsNeeded;

  // will eventually get currentLoad from database;
  const estimateTimeForRequest = (tagName, {startDate, endDate}) => new Promise(function(resolve, reject) {


    estimateNumberOfRequestsNeeded(tagName, {startDate, endDate})
    .then((numReq) => (HOUR * numReq)/(REQ_LIMIT * currentLoad))
    .then((milliseconds) => resolve(moment.duration(milliseconds)))
    .catch((err) => reject(err));

  });

  throttled.estimateTimeForRequest = estimateTimeForRequest;

  return throttled;
};

export {
  throttledAPI as default,
}
