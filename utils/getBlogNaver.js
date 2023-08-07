const getBlogNaver = (place) => {
  const dong = place.address_name.match(/(\S+)동(?=\s| >|$)/);
  return fetch(
    `https://openapi.naver.com/v1/search/blog.json?query=${dong && dong[0]} ${
      place.place_name
    }&display=1`,
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
      console.log(data);

      // 검색되는 블로그가 없다면 getCate에서 해당 식당을 제외시킴
      return data.items.length
        ? {
            blogTitle: data.items[0].title.replace(/<[^>]+>/g, ""),
            blogLink: data.items[0].link,
          }
        : { blogTitle: null };
    });
};

module.exports = getBlogNaver;
