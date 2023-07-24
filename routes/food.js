let router = require("express").Router();

// ----------------------------- 이미지 검색 함수 ---------------------------------

const getImg = (restaurantName) => {
  fetch(
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
      console.log(data.documents.map((it) => it.image_url));
    });
};

// =========================== 식당 제공 API =======================

// 클라이언트가 넘겨주는 것은 공연장 이름과 uuid ->
// 티켓컬렉션에서 uuid일치, 공연장이름 일치하는 좌표 찾고 ->
// 카카오 카테고리 검색에 좌표 넣어서 식당찾고 ->
// 카카오에 식당이름 넣어서 식당사진 찾은 후 넘겨주기

router.get("/get", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.body.uuid, place: req.body.place },
    (err, result) => {
      console.log(result);
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
        .then((data) => {
          console.log(data.documents[0]);
          if (!data.documents[0])
            return response
              .status(200)
              .send(`주변 ${req.query.distance}m 거리에 식당이 없습니다`);
          getImg(data.documents[0]?.place_name);
          // 식당정보중 필요한것과,  식당 이미지들을 객체에 넣고,
          // 이 객체 여러개를 배열로 만들어 제공해야함
        });
    }
  );
});

module.exports = router;
