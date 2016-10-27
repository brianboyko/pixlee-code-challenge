// src/backend/api.js

import Interface from './instagram/Interface';
import knex from './database/db';
import Queries from './database/models/Queries';
import Media from './database/models/Media';
import { QueriesMedia } from './database/models/Intermediates';

const queries = Queries(knex);
const media = Media(knex);
const queriesMedia = QueriesMedia(knex);
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
      let queryId;
      queries.create(req.body.tagName, { startDate: req.body.startDate, endDate: req.body.endDate }, req.body.userEmail)
        .then((ids) => {
          queryId = ids[0];
          return queryId;
        })
        .then((id) => {
          return queries.countInProgress();
        })
        .then((inProg) => {
          let placement = inprog.length + 1;
          res.send({
            message: `Thank you. Your query is #${placement} in the queue. You will recieve an email at ${req.body.userEmail} when we have finished processing`,
            id: queryId;
          })
          return getPhotosInDateRange(tagName, startDate, endDate, null, (inProg.length > 2)))
        })
        .then((photos) => Promise.all(photos.map((photo) => media.create(photo))))
        .then((mediaIds) => Promise.all(
          mediaIds.map(
            (mediaId) => queriesMedia.create({
              query_id: queryId,
              media_id: mediaId
            })
          )
        ))
        .then(() => {
          // TODO: NODEMAILER
        })

      });


    getPhotosInDateRange(req.body.tagName, { startDate: req.body.startDate, endDate: req.body.endDate })
      .then((bundle) => {
        res.send(bundle);
      });
  });
};
