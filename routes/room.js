const router = require("express").Router();
const getCate = require("../utils/getCate");

router.get("/", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.header("uuid"), concert: req.query.concert },
    (err, result) => {
      if (err) return response.status(500).send("internet error");
      if (!result) return response.status(404).send("invalid ticket or uuid");

      getCate(result, "AD5", req.query.distance).then((places) => {
        places.forEach((place) => {
          place.cate = "숙소";
        });

        response.status(200).send(places);
      });
    }
  );
});

module.exports = router;
