var parseString = require("xml2js").parseString;

const getArtKopis = (date) => {
  var regex = /(\d{4})\.(\d{2})\.(\d{2})/;
  var match = regex.exec(date);
  var trimmedDate = match ? match[1] + match[2] + match[3] : null;

  return fetch(
    `https://www.kopis.or.kr/openApi/restful/pblprfr?service=${process.env.KOPIS_API}&stdate=${trimmedDate}&eddate=${trimmedDate}&cpage=1&rows=1000`,
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
