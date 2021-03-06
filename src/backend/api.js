'use strict';
// src/backend/api.js
import moment from 'moment';
import knex from './database/db';
import Interface from './instagram/Interface';
import QueryController from './database/controllers/query';
const queryController = QueryController(knex);
const { getFromIGByTag, getPhotosInDateRange } = Interface;

export default (server, app) => {
  const queryController = QueryController(knex);

  app.get('/api/test', (req, res) => {
    res.send("I'm in L.A. My highlights look okay.");
  });


  app.post('/api/testpost', (req, res) => {
    res.send(req.body.data.toUpperCase());
  });

  app.get('/api/getLatest/:tagname', function (req, res) {
    getFromIGByTag(req.params.tagname)
      .then((data) => JSON.stringify(data))
      .then((jsonData) => res.send(jsonData))
      .catch((e) => console.log(e));
  });

  app.post('/api/createcollection', function (req, res) {
    queryController.startQuery(
      req.body.tagName,
      { startDate: req.body.startDate, endDate: req.body.endDate },
      req.body.userEmail,
      res
    ).catch((e) => console.log(e));
  });

  app.get('/api/getCollection/:queryId', function (req, res) {
    queryController.retrieveQuery(req.params.queryId, res)
      .catch((e) => console.log(e));
  });
};
