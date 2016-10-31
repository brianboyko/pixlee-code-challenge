'use strict';
import moment from 'moment';
import Tags from '../models/Tags';
import Queries from '../models/Queries';
import Media from '../models/Media';
import Images from '../models/Images';
import IgUsers from '../models/IgUsers';
import Videos from '../models/Videos';
import { QueriesMedia } from '../models/Intermediates';
import Interface from '../../instagram/Interface';
import Mailer from '../../mailer/mailer';

const { sendConfirmationEmail, sendResultsEmail } = Mailer;

const { getPhotosInDateRange } = Interface;

/**
 * default ("queryController");
 * @param  {object} knex - Object containing the active connection to the postgres database;
 * @return {object}      - methods "startQuery" and "retrieveQuery"
 */
export default (knex) => {
  const tags = Tags(knex);
  const queries = Queries(knex);
  const queriesMedia = QueriesMedia(knex);
  const media = Media(knex);
  const images = Images(knex);
  const igUsers = IgUsers(knex);
  const videos = Videos(knex);
  // This is the threshhold of simultanious connections to use before throttling. Disabled in this build.
  const LOAD = Infinity;

  /**
   * startQuery - creates and executes a query to the database as well as the Instagram API.
   * @param  {string} tagName    - the name of the tag to search for.
   * @param  {Moment} startDate  - the earliest date to search for.
   * @param  {Moment} endDate    - the latest date to search for.
   * @param  {string} userEmail  - the email address of the user (to send the results to);
   * @param  {callback} res      - a callback to send the front-end data.
   *                                 This is "res" of "req, res" that is provided by Express-built APIs.
   *   @param {object}
   *     @property {Number}      - placement in the queue
   *     @property email         - the email address (sent back to confirm to the user (in case there was a typo.)
   *     @property id            - the ID of the query in the 'queries' table of the postgres database.
   * @return {Promise}           [description]
   *   @resolves {Object} -- N.B.: the resolution here is only used during testing, the relevant callback is "res";
   *     @property {object} resultsEmailInfo - information on whether the results email was successful
   *     @property {object} confirmationEmailInfo - information on whether the confirmation email was successful.
   *     @property {Number} queryId - the ID of the query in the 'queries table of the postgres database.
   *     @property {Array} mediaIds - an array of ID numbers of matching media in the media table of the database.
   *   @rejects {error}
   */
  const startQuery = (tagName, { startDate, endDate }, userEmail, res) => new Promise(function(resolve, reject) {
    let queryId; // closure ensures we have access to this throughout the "then" chain.
    let confirmationEmailInfo;
    let resultsEmailInfo;
    let mediaIds;
    let inProg;

    queries.create(tagName, { startDate, endDate }, userEmail)
      .then((ids) => {
        queryId = ids[0];
        return queries.countInProgress();
      })
      .then((count) => {
        inProg = count;
        let placement = parseInt(inProg[0].count) + 1;
        // we send back the confirmation email info now, even though there's more
        // processing in the function to do.
        res.send({
          placement: placement,
          email: userEmail,
          id: queryId,
        });
        return sendConfirmationEmail(tagName, { startDate, endDate }, userEmail);
      })
      .then((info) => {
        confirmationEmailInfo = info;
        return getPhotosInDateRange(tagName, {
          startDate: moment(startDate).unix(),
          endDate: moment(endDate).unix()
        }, (inProg[0].count > LOAD));
      })
      .then((photos) => Promise.all(photos.data.map((photo) => media.create(photo))))
      .then((ids) => {
        mediaIds = ids.map((id) => id[0]);
        return Promise.all(mediaIds.map(
          (mediaId) => queriesMedia.create({
            query_id: queryId,
            media_id: mediaId
          })));
      })
      .then(() => queries.complete(queryId))
      .then(() => sendResultsEmail(tagName, { startDate, endDate }, userEmail, queryId))
      .then((info) => {
        resultsEmailInfo = info;
        resolve({
          resultsEmailInfo,
          confirmationEmailInfo,
          queryId,
          mediaIds,
        });
      })
      .catch((err) => {
        console.log("catch in queries.create:", err);
        reject(err);
      });
});

  /**
   * retriveQuery - retrieves the appropriate image urls from the database to display to the user.
   * @param  {Number} id         - the ID number of the query in the queries table of the database.
   * @param  {callback} res      - a callback to send the front-end data.
   *                                 This is "res" of "req, res" that is provided by Express-built APIs.
   *   @param {Array}
   *     @elements {object}
   *       @property {object} media - metadata about the image/video
   *         // these singletons should likely be refactored in future builds.
   *       @property {singleton Array w/Object} images - Data about the still images.
   *       @property {singleton Array w/Object} user - Data about the user.
   *       @property {singleton Array w/Object or null} videos - If there are videos, data about the videos.
   * @return {Promise}
   *   @resolves {Object} -- N.B.: the resolution here is only used during testing, the relevant callback is "res";
   *   @rejects {error}
   */
  const retrieveQuery = (id, res) => new Promise(function(resolve, reject) {
    let queryId;
    let startDate;
    let endDate;
    queries.read.byId(id)
      .then((records) => {
        queryId = records[0].id;
        startDate = records[0].earliest_date;
        endDate = records[0].latest_date;
        return records[0];
      })
      .then((record) => queriesMedia.read.by({ query_id: queryId }))
      .then((qmfRecords) => Promise.all(qmfRecords.map((record) => media.read.byId(record.media_id))))
      .then((rawRecords) => rawRecords.map((r) => r[0]))
      .then((qmRecords) => qmRecords.filter((record) => ((
          moment(record.created_time).isSameOrBefore(endDate) &&
          moment(record.created_time).isSameOrAfter(startDate)
        ) || (
          moment(record.caption_created_time).isSameOrBefore(endDate) &&
          moment(record.caption_created_time).isSameOrAfter(startDate)
      ))))
      .then((mRecords) => {
        return Promise.all(mRecords.map((mRecord) => Promise.all([
          mRecord,
          images.read.byId(mRecord.image_id),
          igUsers.read.byId(mRecord.ig_users_id),
          (mRecord.video_id ? videos.read.byId(mRecord.video_id) : null),
        ])));
      })
      .then((results) => results.map((result) => ({
        media: result[0],
        images: result[1],
        user: result[2],
        videos: result[3],
      })))
      .then((data) => {
        res.send(data);
        resolve(data);
      })
      .catch((err) => {
        console.log("catch in queries.retrieveQuery:", err);
        reject(err);
      });
  });

  return {
    startQuery,
    retrieveQuery,
  };
};
