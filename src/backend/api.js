// src/backend/api.js

import Interface from './instagram/interface';
const {getFromIGByTag, getPhotosInDateRange} = Interface;


export default (server, app) => {
  app.get('/api/test', (req, res) => {
    res.send("I'm in L.A. My highlights look okay.")
  })

  app.get('/api/getLatest/:tagname', function (req, res) {
    getFromIGByTag(req.params.tagname)
      .then((data) => JSON.stringify(data))
      .then((jsonData) => res.send(jsonData))
  });

  app.post('/api/createcollection', function (req, res) {
    // req.body contains parameters "tagName", "startDate", "endDate"
    console.log("req.body", req.body); 
    getPhotosInDateRange(req.body.tagName, {startDate: req.body.startDate, endDate: req.body.endDate})
      .then((bundle) => {
        res.send(JSON.stringify(bundle, null, 2))
      })
  });


}
