'use strict';
// ig_users model

export default (knex) => {

  const create = (user) =>  knex('ig_users').insert({
      ig_user_id: parseInt(user.id),
      ig_username: user.username,
      ig_profilepic: user.profile_picture,
      ig_fullname: user.full_name,
    }).returning('id');

  const read = {
    byUsername: (username) => knex('ig_users').where({ ig_username: username }).select(),
    byId: (id) => knex('ig_users').where({ id }).select(),
  };

  // 'delete' is a reserved keyword.
  const del = {
    byUsername: (username) => knex('ig_users').where({ ig_username: username }).del(),
    byId: (id) => knex('ig_users').where({ id }).del(),
  };

  return {
    create,
    read,
    del,
  };
};
