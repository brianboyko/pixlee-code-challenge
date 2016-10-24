// src/backend/api.js

import {getFromIGByTag} from './instagram/interface';

export default (server, app) => {

  app.get('/api/test', (req, res) => {
    res.send("I'm in L.A. My highlights look okay.")
  })

  app.get('/api/getLatest/:tagname', function (req, res) {
    getFromIGByTag(req.params.tagname)
      .then((data) => JSON.stringify(data))
      .then((jsonData) => res.send(jsonData))
  });

}
