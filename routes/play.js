const router = require("express").Router();
const getCateKakao = require("../utils/getCateKakao");
const tourApi = require("../utils/tourApi");

router.get("/", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.header("uuid"), _id: parseInt(req.query.ticketId) },
    async (err, result) => {
      if (err) return response.status(500).send("internet error");
      if (!result) return response.status(404).send("invalid ticket or uuid");

      const places = await tourApi(result, req.query.distance, db);

      for (let i = 0; i < places.length; i++) {
        places[i].cate = "즐길거리";

        // 이미지 없는 데이터 필터과정
        if (places[i].firstimage.length === 0) {
          places.splice(i--, 1);
          continue;
        }

        // 카테고리 필터과정 (32, 39 제외)
        const contenttypeid = parseInt(places[i].contenttypeid);
        if (contenttypeid === 32 || contenttypeid === 39) {
          places.splice(i--, 1);
          continue;
        }
      }

      response.status(200).send(places);
    }
  );
});

module.exports = router;
