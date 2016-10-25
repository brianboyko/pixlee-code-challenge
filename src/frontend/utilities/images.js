import request from 'request';

const ROOT_URL = process.env.ROOT_URL || "http://localhost:3000/";

const getLatest = (tagName) => new Promise((resolve, reject) => {
  request.get({
    url: `${ROOT_URL}/api/getLatest/${tagName}`,
  }, (err, response, body) => {
    if (err) {
      reject(err);
    } else {
      resolve(JSON.parse(body));
    }
  });
});

export default {
  getLatest,
};
