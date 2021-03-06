'use strict';
// media model

import moment from 'moment';
import Images from './Images';
import Videos from './Videos';
import IgUsers from './IgUsers';
import { MediaTags, QueriesMedia } from './Intermediates';


/**
 * Media - model for 'media" table'
 * @param  {object} knex - database connection
 * @return {object}
 *   @method {function} create
 *   @method {function} read
 *   @method {function} del
 */
export default (knex) => {

  const images = Images(knex);
  const igUsers = IgUsers(knex);
  const mediaTags = MediaTags(knex);
  const queriesMedia = QueriesMedia(knex);
  const videos = Videos(knex);

  const create = (media) => {


    const addImage = () => new Promise(function(resolve, reject) {
      resolve(images.create(media.images));
    });
    const addUser = () => new Promise(function(resolve, reject) {
      resolve(igUsers.create(media.user));
    });
    const addVideo = () => new Promise(function(resolve, reject) {
      if(media.type === "video"){
        resolve(videos.create(media.videos));
      } else {
        resolve(null);
      }
    });



    return Promise.all([addImage(), addUser(), addVideo()])
      .then((ids) => knex('media').insert({
          number_likes: media.likes.count,
          number_comments: media.comments.count,
          type: media.type,
          attribution: media.attribution,
          location: JSON.stringify(media.location),
          filter: media.filter,
          created_time: moment.unix(parseInt(media.created_time)).toISOString(),
          link_url: media.link,
          image_id: ids[0][0],
          ig_users_id: ids[1][0],
          video_id: ids[2] ? ids[2][0] : null,
          caption_text: media.caption ? media.caption.text : null,
          caption_created_time: media.caption ? moment.unix(parseInt(media.caption.created_time)).toISOString() : null,
        })
      .returning('id'));

  };

  const read = {
    byId: (id) => knex('media').where({ id }).select(),
    byCreatedTime: (range) => knex('media').whereBetween('created_time', [range.startDate, range.endDate]),
  };

  // 'delete' is a reserved keyword.
  const del = {
    byId: (id) => knex('media').where({ id }).del(),
  };

  return {
    create,
    read,
    del,
  };
};
