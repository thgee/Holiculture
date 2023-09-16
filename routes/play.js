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

      const tourRes = await tourApi(result, req.query.distance, db);
      const places = [];

      for (let i = 0; i < tourRes?.length; i++) {
        // 이미지 없는 데이터 필터과정
        if (tourRes[i].firstimage.length === 0) {
          tourRes.splice(i--, 1);
          continue;
        }

        // 카테고리 필터과정 (숙박:32, 식당:39 제외)
        const contenttypeid = parseInt(tourRes[i].contenttypeid);
        if (contenttypeid === 32 || contenttypeid === 39) {
          tourRes.splice(i--, 1);
          continue;
        }

        places.push({
          place_name: tourRes[i].title,
          place_url: `https://search.daum.net/search?w=tot&q=${tourRes[i].title}`,
          category_name: tourRes[i].contenttypeid,
          distance: String(parseInt(tourRes[i].dist)),
          x: tourRes[i].mapx,
          y: tourRes[i].mapy,
          road_address_name: tourRes[i].addr1,
          img: tourRes[i].firstimage,
        });
        // // isLike 추가 작업
        const likeCollection = await db.collection("like").findOne({
          uuid: req.headers.uuid,
          road_address_name: places[i].road_address_name,
        });
        console.log(likeCollection);
        places[i].isLike = likeCollection ? true : false;
      }

      response.status(200).send(places);
    }
  );
});

module.exports = router;
