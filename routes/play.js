const router = require("express").Router();
const getCate = require("../utils/getCate");

router.get("/", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.body.uuid, concert: req.body.concert },
    (err, result) => {
      getCate(result, "AT4", req.query.distance).then((places) => {
        if (places.length === 0) {
          return response
            .status(200)
            .send(`근처 ${req.query.distance}m 거리에 즐길거리가 없습니다`);
        }

        places.forEach((place) => {
          place.cate = "즐길거리";
        });

        response.status(200).send(places);
      });
    }
  );
});

module.exports = router;
