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
