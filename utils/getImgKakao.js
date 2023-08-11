const getImgKakao = (place_name) => {
  return fetch(
    `https://dapi.kakao.com/v2/search/image?sort=accuracy&page=1&query=${place_name}&size=1`,
    {
      method: "GET",
      headers: { Authorization: process.env.KAKAO_API },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const img = data.documents[0].image_url;
      return img;
    });
};

module.exports = getImgKakao;
