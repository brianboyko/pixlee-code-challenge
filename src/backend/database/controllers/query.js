import Tags from '../models/Tags';
import Queries from '../models/Queries';
import { QueriesMedia } from '../models/Intermediates';
import Interface from '../../instagram/Interface';
import { sendConfirmationEmail, sendResultsEmail } from '../../mailer/mailer';

const { getPhotosInDateRange } = Interface;

export default (knex) => {
  const tags = Tags(knex);
  const queries = Queries(knex);
  const queriesMedia = QueriesMedia(knex);
  const LOAD = Infinity;

  const startQuery = (tagName, { startDate, endDate }, userEmail, res) => {
    console.log("Running query controller");
    let queryId; // closure ensures we have access to this throughout the "then" chain.
    // create the query in the database
    queries.create(tagName, { startDate: startDate, endDate: endDate }, userEmail)
    .then((ids) => {
      queryId = ids[0];
      console.log("got id", queryId);
      return queries.countInProgress();
    })
    .then((inProg) => {
      let placement = inprog.length + 1;
      res.send({
        placement: placement,
        email: userEmail,
        id: queryId,
      });
      console.log("Just got Res.send");

      sendConfirmationEmail(tagName, startDate, endDate, userEmail);
      // tell the API to grab the photos
      return getPhotosInDateRange(tagName, startDate, endDate, null, (inProg.length > LOAD));
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
      queries.complete(queryId);
      return sendResultsEmail(tagName, startDate, endDate, userEmail, queryId);
    })
    .catch((e) => {
      res.send({ error: e });
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
