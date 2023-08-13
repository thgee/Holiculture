const getImgKakao = require("./getImgKakao");

const getCateKakao = (ticket, cate, distance) => {
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

      // 이미지 추가 작업
      for (let i = 0; i < places.length; i++) {
        places[i].img = await getImgKakao(places[i]);
      }

      return places;
    });
};

module.exports = getCateKakao;
