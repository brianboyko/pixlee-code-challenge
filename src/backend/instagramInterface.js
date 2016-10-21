import request from 'request'

const ITOKEN = '272855367.b6f7db4.27aee70b486a4fd7b1b5546c1da0453d';
const ROOT_URL = 'https://api.instagram.com/v1/tags/';
const TAIL_URL = '/media/recent?access_token=';

export const makeEndpoint = (tagName) => ROOT_URL + tagName.toLowerCase() + TAIL_URL + ITOKEN

export const getFromIGByTag = (tagName) => new Promise(function(resolve, reject) {
  request.get(makeEndpoint(tagName), (err, response, body) => {
    if(err){
      reject(err);
    } else {
      resolve(JSON.parse(body));
    }
  })
});
