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
      return data.items?.length
        ? {
            blogTitle: data.items[0].title.replace(/<[^>]+>/g, ""),
            blogLink: data.items[0].link,
          }
        : { blogTitle: null };
    });
};

module.exports = getBlogNaver;
