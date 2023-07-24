let router = require("express").Router();

// ----------------------------- 이미지 검색 함수 ---------------------------------

const getImg = (restaurantName) => {
  return fetch(
    `https://dapi.kakao.com/v2/search/image?sort=accuracy&page=1&query=${restaurantName}&size=3`,
    {
      method: "GET",
      headers: { Authorization: process.env.KAKAO_API },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const imgs = data.documents.map((it) => it.image_url);
      return imgs;
      // 식당 이미지를 배열로 반환
    });
};
// =========================== 식당정보 API =======================

// 클라이언트가 넘겨주는 것은 공연장 이름과 uuid ->
// 티켓컬렉션에서 uuid일치, 공연장이름 일치하는 좌표 찾고 ->
// 카카오 카테고리 검색에 좌표 넣어서 식당찾고 ->
// 카카오에 식당이름 넣어서 식당사진 찾은 후 넘겨주기

router.get("/get", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.body.uuid, place: req.body.place },
    (err, result) => {
      fetch(
        `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&page=1&size=15&sort=accuracy&x=${parseFloat(
          result.posX
        )}&y=${parseFloat(result.posY)}&radius=${
          parseInt(req.query.distance) || 500
        }`,
        {
          method: "GET",
          headers: { Authorization: process.env.KAKAO_API },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then(async (data) => {
          if (!data.documents[0]) {
            return response
              .status(200)
              .send(`주변 ${req.query.distance}m 거리에 식당이 없습니다`);
          }

          let foods = data.documents?.map((food) => {
            return {
              place_name: food.place_name,
              place_url: food.place_url,
              category_name: food.category_name?.match(/>([^>]+)$/)[1]?.trim(),
              distance: food.distance,
              x: food.x,
              y: food.y,
              road_address_name: food.road_address_name,
            };
          });
          return foods;
        })
        .then(async (foods) => {
          for (let i = 0; i < foods.length; i++) {
            foods[i].imgs = await getImg(foods[i].place_name);
          }
          response.status(200).send(foods);
        });
    }
  );
});

module.exports = router;
