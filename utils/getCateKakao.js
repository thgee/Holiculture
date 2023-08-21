const getBlogNaver = require("./getBlogNaver");
const getImgKakao = require("./getImgKakao");

const getCateKakao = (ticket, cate, distance, db) => {
  return fetch(
    `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${cate}&page=1&size=10&sort=accuracy&x=${parseFloat(
      ticket?.posX
    )}&y=${parseFloat(ticket?.posY)}&radius=${parseInt(distance) || 500}`,
    {
      method: "GET",
      headers: { Authorization: process.env.KAKAO_API },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then(async (data) => {
      let places = data.documents?.map((place) => {
        return {
          place_name: place.place_name,
          place_url: place.place_url,
          category_name: place.category_name?.match(/>([^>]+)$/)[1]?.trim(),
          distance: place.distance,
          x: place.x,
          y: place.y,
          road_address_name: place.road_address_name,
          address_name: place.address_name,
        };
      });

      for (let i = 0; i < places.length; i++) {
        // isLike 추가 작업
        db.collection("like").findOne(
          {
            uuid: ticket.uuid,
            road_address_name: places[i].road_address_name,
          },
          (err, result) => {
            if (err) throw err;
            places[i].isLike = result ? true : false;
          }
        );
        // 이미지 추가 작업 (이미지가 없다면 places에서 제거시킴)
        let image = await getImgKakao(places[i]);
        if (image) places[i].img = image;
        else {
          places.splice(i--, 1);
          continue;
        }

        // 블로그 추가 작업
        let { blogTitle, blogLink } = await getBlogNaver(places[i]);
        if (blogTitle) {
          places[i].blogTitle = blogTitle;
          places[i].blogLink = blogLink;
        } else {
          places.splice(i--, 1);
          continue;
        }
      }

      return places;
    });
};

module.exports = getCateKakao;
