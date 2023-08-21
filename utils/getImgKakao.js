const getImgKakao = (place) => {
  // const dong = place.address_name.match(/(\S+)동(?=\s| >|$)/);
  // ${dong && dong[0]} 동 필요할 시 쿼리 place_name 앞에 추가할 것
  return fetch(
    `https://dapi.kakao.com/v2/search/image?sort=accuracy&page=1&query=${place.place_name}&size=1`,
    {
      method: "GET",
      headers: { Authorization: process.env.KAKAO_API },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const img = data.documents[0]?.image_url;

      return img || null;
    });
};

module.exports = getImgKakao;
