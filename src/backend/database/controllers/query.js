import knex from '../db';

import Tags from '../models/Tags';
import Queries from '../models/Queries';
import Intermediates from '../models/Intermediates';
import Interface from '../instagram/Interface';
import { sendConfirmationEmail, sendResultsEmail } from '../mailer/mailer';

const { getPhotosInDateRange } = Interface;

export default (knex) => {
  const tags = Tags(knex);
  const queries = Queries(knex);
  const queriesMedia = Intermediates.QueriesMedia(knex);

  const startQuery = (tagName, { startDate, endDate }, userEmail, res) => {
    let queryId; // closure ensures we have access to this throughout the "then" chain.
    // create the query in the database
    queries.create(tagName, { startDate: startDate, endDate: endDate }, userEmail)
    // get the ID of the query and store it in the closure variable.
    .then((ids) => {
      queryId = ids[0];
      return queryId;
    })
    // get the load
    .then((id) => {
      return queries.countInProgress();
    })
    // Notify the user that their query had been processed.
    .then((inProg) => {
      let placement = inprog.length + 1;
      res.send({
        placement: placement,
        email: userEmail,
        id: queryId,
      });
      sendConfirmationEmail(tagName, startDate, endDate, userEmail);
      // tell the API to grab the photos
      return getPhotosInDateRange(tagName, startDate, endDate, null, (inProg.length > 2));
    })
    // create database entries for each photo
    .then((photos) => Promise.all(photos.map((photo) => media.create(photo))))
    // create a relation between the query and the photo
    .then((mediaIds) => Promise.all(
      mediaIds.map(
        (mediaId) => queriesMedia.create({
          query_id: queryId,
          media_id: mediaId
        })
      )
    ))
    // when the query completes, send the results email.
    // the user will be able to access the results directly through the API.
    .then(() => {
      queries.complete(queryId);
      sendResultsEmail(tagName, startDate, endDate, userEmail, queryId);
    });
  };

  const retrieveQuery = (id, res) => new Promise(function(resolve, reject) {
    let queryId;
    let startDate;
    let endDate;
    queries.read.byId(id)
      .then((records) => {
        queryId = records[0].id;
        startDate = records[0].earliest_date;
        endDate = recores[0].latest_date;
        return records[0];
      })
      .then((record) => queriesMedia.read.by({ query_id: queryId }))
      .then((qmRecords) => qmRecords.filter((record) => {
        return (record.created_time >= startDate && record.created_time <= endDate) ||
          (record.caption_created_time >= startDate && record.caption_created_time <= endDate);
      }))
      .then((qmfRecords) => qmfRecords.map((record) => media.read.byId(record.mediaId)))
      .then((mRecords) => Promise.all(mRecords.map((mRecord) => Promise.all([
          mRecord,
          images.read.byId(mRecord.media_id),
          igUsers.read.byId(mRecord.ig_users_id)
      ]))))
      .then((results) => results.map((result) => ({
        queries_media: result[0],
        images: result[1],
        user: result[2]
      })))
      .then((data) => {
        res.send(data);
      });
  });

  return {
    startQuery,
    retrieveQuery,
  };
};
