// 카테고리 그룹 코드
// MT1=대형마트 / CS2=편의점 / PS3=어린이집, 유치원 / SC4=학교
// AC5=학원 / PK6=주차장 / OL7=주유소, 충전소 / SW8=지하철역
// BK9=은행 / CT1=문화시설 / AG2=중개업소 / PO3=공공기관
// AT4=관광명소 / AD5=숙박 / FD6=음식점 / CE7=카페 / HP8=병원 / PM9=약국

// getCate에서 getImg 함수를 사용하여 이미지까지 넣어준 후 반환해줌
// getImg 두번째 인자로 이미지 개수 설정 가능

const getImg = require("../utils/getImg");

// 매개변수 : (찾은 티켓, 찾을 장소의 카테고리, 탐색범위m)
const getCate = (ticket, cate, distance) => {
  return fetch(
    `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${cate}&page=1&size=15&sort=accuracy&x=${parseFloat(
      ticket?.posX
    )}&y=${parseFloat(ticket?.posY)}&radius=${parseInt(distance) || 500}`,
    {
      method: "GET",
      headers: { Authorization: process.env.KAKAO_API },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then(async (data) => {
      let places = data.documents?.map((place) => {
        return {
          place_name: place.place_name,
          place_url: place.place_url,
          category_name: place.category_name?.match(/>([^>]+)$/)[1]?.trim(),
          distance: place.distance,
          x: place.x,
          y: place.y,
          road_address_name: place.road_address_name,
        };
      });
      return places;
    })
    .then(async (places) => {
      for (let i = 0; i < places.length; i++) {
        places[i].imgs = await getImg(places[i].place_name, 3);
      }
      return places;
    });
};

module.exports = getCate;
