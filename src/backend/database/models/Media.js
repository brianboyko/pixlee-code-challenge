// Tags model
import Images from './Images';
import IgUsers from './IgUsers';

export default (knex) => {

  const create = (media) => {

    const addImage = () => new Promise(function(resolve, reject) {
      resolve(Images.create(media.images));
    });
    const addUser = () => new Promise(function(resolve, reject) {
      resolve(IgUsers.create(media.user))
    });

    return Promise.all([addImage(), addUser()])
      .then((ids) => knex('media').insert({
        number_likes: media.likes.count,
        number_comments: media.comments.count,
        type: media.type,
        attribution: media.attribution,
        location: JSON.stringify(media.location),
        filter: media.filter,
        created_time: media.created_time,
        link_url: media.link,
        caption_text: media.caption.text,
        caption_created_time: media.caption.created_time,
        image_id: ids[0],
        ig_user_id: ids[1],
    }).returning('id');
  }

  const read = {
    byId: (id) => knex('media').where({id}).select(),
    byCreatedTime: (range) => knex.('media').where()
  }
  // 'delete' is a reserved keyword.
  const del = {
    byId: (id) => knex('media').where({id}).del(),
  }
  return {
    create,
    read,
    del,
  }
};

// {
//      "attribution": null,
//      "tags": [
//        "swissday",
//        "mtvieworchards",
//        "yodeling"
//      ],
//      "type": "image",
//      "location": null,
//      "comments": {
//        "count": 1
//      },
//      "filter": "Ludwig",
//      "created_time": "1477181705",
//      "link": "https://www.instagram.com/p/BL4ovqxBHoB/",
//      "likes": {
//        "count": 6
//      },
//      "images": {
//        "low_resolution": {
//          "url": "https://scontent.cdninstagram.com/t51.2885-15/s320x320/e35/14730533_1199060076783617_8589921376385630208_n.jpg?ig_cache_key=MTM2NzAyMTY4NDUwMjMyOTg1Nw%3D%3D.2.l",
//          "width": 320,
//          "height": 320
//        },
//        "thumbnail": {
//          "url": "https://scontent.cdninstagram.com/t51.2885-15/s150x150/e35/c0.135.1080.1080/14730752_2115658318659912_972747540640301056_n.jpg?ig_cache_key=MTM2NzAyMTY4NDUwMjMyOTg1Nw%3D%3D.2.c",
//          "width": 150,
//          "height": 150
//        },
//        "standard_resolution": {
//          "url": "https://scontent.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/14730533_1199060076783617_8589921376385630208_n.jpg?ig_cache_key=MTM2NzAyMTY4NDUwMjMyOTg1Nw%3D%3D.2.l",
//          "width": 640,
//          "height": 640
//        }
//      },
//      "users_in_photo": [],
//      "caption": {
//        "created_time": "1477181705",
//        "text": "A little bit of yodeling. #swissday #mtvieworchards #yodeling",
//        "from": {
//          "username": "ramonakk",
//          "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/s150x150/13649193_1738641446409044_2048445020_a.jpg",
//          "id": "45324158",
//          "full_name": ""
//        },
//        "id": "17843516221185879"
//      },
//      "user_has_liked": false,
//      "id": "1367021684502329857_45324158",
//      "user": {
//        "username": "ramonakk",
//        "profile_picture": "https://scontent.cdninstagram.com/t51.2885-19/s150x150/13649193_1738641446409044_2048445020_a.jpg",
//        "id": "45324158",
//        "full_name": ""
//      }
//    },
