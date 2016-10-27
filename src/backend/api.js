// src/backend/api.js

import knex from './database/db';
import Interface from './instagram/Interface';
import QueryController from './database/controllers/query';

const { getFromIGByTag, getPhotosInDateRange } = Interface;

export default (server, app) => {
  app.get('/api/test', (req, res) => {
    res.send("I'm in L.A. My highlights look okay.");
  });

  app.get('/api/getLatest/:tagname', function (req, res) {
    getFromIGByTag(req.params.tagname)
      .then((data) => JSON.stringify(data))
      .then((jsonData) => res.send(jsonData));
  });

  app.post('/api/createcollection', function (req, res) {
    QueryController(knex)
      .startQuery(
        req.body.tagName,
        { startDate: req.body.startDate, endDate: req.body.endDate },
        req.body.userEmail,
        res);
  });
};
