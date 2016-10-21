// src/backend/server.js

import lib_request from 'request';

export default (testDeps = {}) => {
  let request = testDeps.request || lib_request;
  const TEST_ROOT = 'https://jsonplaceholder.typicode.com';

  const getTest = () => new Promise((resolve, reject) => {
    request.get(TEST_ROOT + '/posts/1', (err, response, body) => {
      if(err){
        reject(err);
        return;
      }
      resolve(JSON.parse(body));
    })
  });

  return {
    getTest,
  }
}
