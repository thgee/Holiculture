let router = require("express").Router();

// 클라이언트가 넘겨주는 것은 공연장 이름과 uuid ->
// 티켓컬렉션에서 uuid일치, 공연장이름 일치하는 도로명주소 찾고 ->
// 카카오에 도로명 넣어서 식당찾고 ->
// 카카오에 식당이름 넣어서 식당사진 찾은 후 넘겨주기

router.get("/getfood", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db

  db.collection("ticket").findOne(
    { uuid: req.uuid, place: req.place },
    (err, result) => {}
  );
  fetch(
    `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&radius=500`,
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
      getImg(data.documents[0].place_name);
    });
});

// ----------------------------- 이미지 검색 ---------------------------------

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

module.exports = router;
