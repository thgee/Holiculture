const router = require("express").Router();
const getCateKakao = require("../utils/getCateKakao");
const getPlaceInfoNaver = require("../utils/getPlaceInfoNaver");

router.get("/", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.header("uuid"), concert: req.query.concert },
    (err, result) => {
      if (err) return response.status(500).send("internet error");
      if (!result) return response.status(404).send("invalid ticket or uuid");
      getCateKakao(result, "FD6", req.query.distance).then(async (places) => {
        for (let i = 0; i < places.length; i++) {
          places[i].cate = "식당";

          let placeInfo = await getPlaceInfoNaver(places[i]);

          // 네이버 검색결과가 없으면 places 배열에서 제외시킴
          if (!placeInfo.id) {
            places.splice(i--, 1);
            continue;
          }

          // 키워드 추출
          places[i].keywords =
            placeInfo?.keywords != 0 ? placeInfo?.keywords : [];

          // 이미지 추출
          let foodImg = placeInfo?.themes?.baemin?.items[0]?.menus[0]?.imageUrl;
          places[i].img =
            foodImg || (placeInfo?.images && placeInfo?.images[0].url) || null;
        }

        response.status(200).send(places);
      });
    }
  );
});

module.exports = router;
