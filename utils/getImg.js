// ----------------------------- 이미지 검색 함수 ---------------------------------

const getImg = (place_name, numOfImage) => {
  return fetch(
    `https://dapi.kakao.com/v2/search/image?sort=accuracy&page=1&query=${place_name}&size=${numOfImage}`,
    {
      method: "GET",
      headers: { Authorization: process.env.KAKAO_API },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const imgs = data.documents.map((it) => it.image_url);
      return imgs;
    });
};

module.exports = getImg;
