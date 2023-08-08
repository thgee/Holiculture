const router = require("express").Router();
const getCateKakao = require("../utils/getCateKakao");

router.get("/", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.header("uuid"), concert: req.query.concert },
    (err, result) => {
      if (err) return response.status(500).send("internet error");
      if (!result) return response.status(404).send("invalid ticket or uuid");
      getCateKakao(result, "FD6", req.query.distance).then((places) => {
        places.forEach((place) => {
          place.cate = "식당";
        });
        response.status(200).send(places);
      });
    }
  );
});

module.exports = router;
