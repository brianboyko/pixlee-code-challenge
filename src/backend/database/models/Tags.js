// Tags model
export default (knex) => {

  const create = (tag_name) => knex('tags').insert({ tag_name })
    .returning('id');

  const read = {
    byName: (tag_name) => knex('tags').where({ tag_name }).select(),
    byId: (id) => knex('tags').where({ id }).select(),
  };

  const del = {
    byName: (tag_name) => knex('tags').where({ tag_name }).del(),
    byId: (id) => knex('tags').where({ id }).del(),
  };

  const getOrAdd = (tag_name) => new Promise(function(resolve, reject) {
    read.byName(tag_name).then((record) => {
      if(record.length > 0){
        resolve(record[0]);
      } else {
        create(tag_name).then((id) => {
          resolve({ id: id[0], tag_name: tag_name });
        });
      }
    });
  });

  return {
    create,
    read,
    del,
    getOrAdd,
  };
};
