var parseString = require("xml2js").parseString;

const getEventKopis = () => {
  return fetch(
    `https://www.kopis.or.kr/openApi/restful/pblprfr?service=${process.env.KOPIS_API}&stdate=20230829&eddate=20230830&cpage=1&rows=10`,
    {
      method: "GET",
    }
  ).then(async (response) => {
    let xmlText = await response.text();
    parseString(xmlText, function (err, result) {
      console.log(result.dbs.db);
    });
  });
};

getEventKopis();

module.exports = getEventKopis;
