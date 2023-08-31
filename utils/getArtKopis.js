var parseString = require("xml2js").parseString;

const getArtKopis = (date) => {
  return fetch(
    `https://www.kopis.or.kr/openApi/restful/pblprfr?service=${process.env.KOPIS_API}&stdate=${date}&eddate=${date}&cpage=1&rows=10`,
    {
      method: "GET",
    }
  )
    .then((response) =>
      // xml 형식을 json 형식으로 변환
      response.text()
    )
    .then((data) => {
      let arts;
      parseString(data, function (err, result) {
        arts = result.dbs?.db;
      });
      return arts || [];
    });
};
module.exports = getArtKopis;
