import request from 'request'

const ITOKEN = '272855367.b6f7db4.27aee70b486a4fd7b1b5546c1da0453d';

export const makeEndpoint = (tagName) => 'https://api.instagram.com/v1/tags/' + tagName.toLowerCase() + '/media/recent';

// note. Instagram will only return 33 photos, no matter what you need.
// This is why the recursive "get this many photos" is needed.
export const getFromIGByTag = (tagName) => new Promise(function(resolve, reject) {

  request.get({
    url: makeEndpoint(tagName),
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

export const getFromFullURL = (fullURL) => new Promise(function(resolve, reject) {
  request.get(fullURL, (err, response, body) => {
    if(err){
      reject(err);
    } else {
      resolve(JSON.parse(body));
    }
  })
});

export const consolidate = (firstData, nextData) => {
  let smushObj = firstData;
  smushObj.pagination.next_max_id = nextData.pagination.next_max_id;
  smushObj.pagination.next_url = nextData.pagination.next_url;
  smushObj.data = firstData.data.concat(nextData.data);
  return smushObj;
}

export const getThisManyPhotos = (numPhotos, tagName, previous) => new Promise((resolve, reject) => {
  if (!previous) {
    getFromIGByTag(tagName).then((igResp) => {
      if (igResp.data.length < numPhotos || igResp.data.length === 20) {
        resolve(getThisManyPhotos(numPhotos, tagName, igResp));
      } else {
        resolve(igResp);
      }
    }).catch((err) => reject(err));
  } else {
    getFromFullURL(previous.pagination.next_url).then((igResp) => {
      let bundle = consolidate(previous, igResp);
      if (bundle.data.length >= numPhotos || igResp.data.length < 20 || bundle.pagination.next_url === null) {
        resolve(bundle);
      } else {
        resolve(getThisManyPhotos(numPhotos, tagName, bundle));
      }
    }).catch((err) => reject(err));
  }
})
