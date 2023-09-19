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

        // 카테고리 필터과정 (숙박:32, 쇼핑:38, 식당:39 제외)
        const contenttypeid = parseInt(tourRes[i].contenttypeid);
        if (
          contenttypeid === 32 ||
          contenttypeid === 38 ||
          contenttypeid === 39
        ) {
          tourRes.splice(i--, 1);
          continue;
        }

        // 카테고리 변환
        let cate;
        switch (parseInt(tourRes[i].contenttypeid)) {
          case 12:
            cate = "관광지";
            break;
          case 14:
            cate = "문화시설";
            break;
          case 15:
            cate = "축제 및 공연";
            break;
          case 25:
            cate = "여행코스";
            break;
          case 28:
            cate = "레포츠";
            break;
        }
        places.push({
          place_name: tourRes[i].title,
          place_url: `https://search.daum.net/search?w=tot&q=${tourRes[i].title}`,
          category_name: cate,
          distance: String(parseInt(tourRes[i].dist)),
          x: tourRes[i].mapx,
          y: tourRes[i].mapy,
          road_address_name: tourRes[i].addr1,
          img: tourRes[i].firstimage.replace(/^http(?!s)/, "https"),
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
