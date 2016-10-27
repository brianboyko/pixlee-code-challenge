// images model
export default (knex) => {
  const create = (image) => knex('images').insert({
    low_url: image.low_resolution.url,
    low_width: image.low_resolution.width,
    low_height: image.low_resolution.height,
    standard_url: image.standard_resolution.url,
    standard_width: image.standard_resolution.width,
    standard_height: image.standard_resolution.height,
    thumb_url: image.thumbnail.url,
    thumb_width: image.thumbnail.width,
    thumb_height: image.thumbnail.height,
  }).returning('id');


  const read = {
    byId: (id) => knex('images').where({ id }).select(),
  };
  // 'delete' is a reserved keyword.
  const del = {
    byId: (id) => knex('images').where({ id }).del(),
  };

  return {
    create,
    read,
    del,
  };
};
