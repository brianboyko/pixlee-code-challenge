// Tags model
export default (knex) => {
  const create = (tag_name) => knex('tags').insert({tag_name})
    .returning('id');
  const read = {
    byName: (tag_name) => knex('tags').where({tag_name}).select(),
    byId: (id) => knex('tags').where({id}).select(),
  }
  const del = {
    byName: (tag_name) => knex('tags').where({tag_name}).del(),
    byId: (id) => knex('tags').where({id}).del(),
  }
  return {
    create,
    read,
    del,
  }
};
