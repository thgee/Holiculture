const getImgNaver = (place_name) => {
  return fetch(
    `https://openapi.naver.com/v1/search/image.json?query=${place_name}&display=1`,
    {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_API_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_API_CLIENT_SECRET,
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.items?.length
        ? {
            img: data.items[0].link,
          }
        : { img: null };
    });
};

module.exports = getImgNaver;
