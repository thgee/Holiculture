const router = require("express").Router();
const getImg = require("../utils/getImg");
const getCate = require("../utils/getCate");

// =========================== 식당정보 API =======================

// 클라이언트가 넘겨주는 것은 공연장 이름과 uuid
// 티켓컬렉션에서 uuid일치, 공연장이름 일치하는 좌표 찾고 ->
// 카카오 카테고리 검색에 좌표 넣어서 식당찾고 ->
// 카카오에 식당이름 넣어서 식당사진 찾은 후 넘겨주기

router.get("/get", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.body.uuid, place: req.body.place },
    (err, result) => {
      getCate(result, "FD6", req.query.distance)
        .then(async (data) => {
          if (!data.documents[0]) {
            return response
              .status(200)
              .send(`근처 ${req.query.distance}m 거리에 식당이 없습니다`);
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
            foods[i].imgs = await getImg(foods[i].place_name, 3);
          }
          response.status(200).send(foods);
        });
    }
  );
});

module.exports = router;
