// src/backend/api.js

import throttledAPI from './instagram/interface';

const getLatestTags = throttledAPI().getFromIGByTag;


export default (server, app) => {

  app.get('/api/test', (req, res) => {
    res.send("I'm in L.A. My highlights look okay.")
  })

  app.get('/api/getLatestTags/:tagname', function (req, res) {
    getLatestTags(req.params.tagname)
      .then((data) => JSON.stringify(data))
      .then((jsonData) => res.send(jsonData))
  });

}
