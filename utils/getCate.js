// 카테고리 그룹 코드
// MT1=대형마트 / CS2=편의점 / PS3=어린이집, 유치원 / SC4=학교
// AC5=학원 / PK6=주차장 / OL7=주유소, 충전소 / SW8=지하철역
// BK9=은행 / CT1=문화시설 / AG2=중개업소 / PO3=공공기관
// AT4=관광명소 / AD5=숙박 / FD6=음식점 / CE7=카페 / HP8=병원 / PM9=약국

// 매개변수 : (찾은 티켓, 찾을 장소의 카테고리, 탐색범위m)
const getCate = (ticket, cate, distance) => {
  return fetch(
    `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${cate}&page=1&size=15&sort=accuracy&x=${parseFloat(
      ticket.posX
    )}&y=${parseFloat(ticket.posY)}&radius=${parseInt(distance) || 500}`,
    {
      method: "GET",
      headers: { Authorization: process.env.KAKAO_API },
    }
  ).then((response) => {
    return response.json();
  });
};

module.exports = getCate;
