const express = require("express");
const app = express();
app.use("/public", express.static("public"));
require("dotenv").config();

console.log(
  "===================\n===================\n=====코드실행======\n===================\n===============================================================================================\n"
);

// app.listen(8080, function () {
//   console.log(

//     "===================\n=====서버실행======\n===================\n"
//   );
// });

// ----------------------------- 키워드로 장소 검색 ---------------------------------

// const getPos = () => {
//   let keyword = "미식반점";
//   fetch(
//     `https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=15&sort=accuracy&query=${keyword}`,
//     {
//       method: "GET",
//       headers: { Authorization: process.env.KAKAO_API },
//     }
//   )
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//     });
// };

// ----------------------------- 주변 음식점 검색 ---------------------------------

const getRestaurant = (posX, posY) => {
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

getRestaurant(127.07083238839516, 37.548888556812464);

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
