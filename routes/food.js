let router = require("express").Router();
require("dotenv").config();

router.get("/shop/shirts", function (req, response) {
  응답.send("셔츠 파는 페이지입니다.");
});


// ----------------------------- 주변 음식점 검색 ---------------------------------
 = (posX, posY) => {
  fetch(
    `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&x=${posX}&y=${posY}&radius=100`,
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
};

getRestaurant();

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
