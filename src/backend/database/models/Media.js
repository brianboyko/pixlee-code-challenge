// media model

import moment from 'moment';
import Images from './Images';
import IgUsers from './IgUsers';
import { MediaTags, QueriesMedia } from './Intermediates';

export default (knex) => {

  const images = Images(knex);
  const igUsers = IgUsers(knex);
  const mediaTags = MediaTags(knex);
  const queriesMedia = QueriesMedia(knex);

  const create = (media) => {

    const addImage = () => new Promise(function(resolve, reject) {
      resolve(images.create(media.images));
    });
    const addUser = () => new Promise(function(resolve, reject) {
      resolve(igUsers.create(media.user));
    });

    return Promise.all([addImage(), addUser()])
      .then((ids) => knex('media').insert({
        number_likes: media.likes.count,
        number_comments: media.comments.count,
        type: media.type,
        attribution: media.attribution,
        location: JSON.stringify(media.location),
        filter: media.filter,
        created_time: moment.unix(parseInt(media.created_time)).toISOString(), // be careful, this is Unix, not JS time.
        link_url: media.link,
        caption_text: media.caption.text,
        caption_created_time: moment.unix(parseInt(media.caption.created_time)).toISOString(),
        image_id: ids[0][0],
        ig_users_id: ids[1][0],
      }).returning('id'));

  };

  const read = {
    byId: (id) => knex('media').where({ id }).select(),
    byCreatedTime: (range) => knex('media').whereBetween('creted_time', [range.startDate, range.endDate]),
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
