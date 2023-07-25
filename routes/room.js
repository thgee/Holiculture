const router = require("express").Router();
const getImg = require("../utils/getImg");
const getCate = require("../utils/getCate");

// =========================== 숙소정보 API =======================

router.get("/get", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.body.uuid, place: req.body.place },
    (err, result) => {
      getCate(result, "AD5", req.query.distance)
        .then(async (data) => {
          if (!data.documents[0]) {
            return response
              .status(200)
              .send(`근처 ${req.query.distance}m 거리에 숙소가 없습니다`);
          }
          let rooms = data.documents?.map((room) => {
            return {
              place_name: room.place_name,
              place_url: room.place_url,
              category_name: room.category_name?.match(/>([^>]+)$/)[1]?.trim(),
              distance: room.distance,
              x: room.x,
              y: room.y,
              road_address_name: room.road_address_name,
            };
          });
          return rooms;
        })
        .then(async (rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            rooms[i].imgs = await getImg(rooms[i].place_name, 3);
          }
          response.status(200).send(rooms);
        });
    }
  );
});

module.exports = router;
