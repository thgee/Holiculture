// 한달에 한번 터미널로 해당 js파일을 실행하세요
// KOPIS의 OpenAPI에서 공연정보를 받아와 DB를 업데이트 합니다
// 23.09.11 ~ 23.10.10 업데이트 완료

var parseString = require("xml2js").parseString;
const MongoClient = require("mongodb").MongoClient; // 몽고db 연결
require("dotenv").config({ path: "../.env" }); // 환경변수

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const updateArt = (startDate, endDate) => {
  // ================ DB 연결 ==================
  let db;
  MongoClient.connect(
    process.env.MONGODB_URL,
    { useUnifiedTopology: true },
    (err, client) => {
      if (err) return console.log(err);
      db = client.db("Holliculture");
      // kopis에서 공연정보 불러오기
      fetch(
        `https://www.kopis.or.kr/openApi/restful/pblprfr?service=${process.env.KOPIS_API}&stdate=${startDate}&eddate=${endDate}&cpage=1&rows=5000`,
        {
          method: "GET",
        }
      )
        .then((response) =>
          // xml 형식을 json 형식으로 변환
          response.text()
        )
        .then((data) => {
          parseString(data, async function (err, result) {
            let arts = result.dbs?.db;
            console.log(arts.length);
            // 공연정보를 하나씩 돌면서 db에 저장
            for (let i = 0; i < arts.length; i++) {
              await delay(5);

              let id;
              let it = arts[i];

              // 이미지 없는 데이터 필터과정
              if (it?.poster[0].length === 0) {
                arts.splice(i--, 1);
                continue;
              }

              let address = await getPlaceCode(it?.fcltynm[0]);
              await db
                .collection("counter")
                .findOne({ name: "artId" })
                .then((data) => {
                  id = data.id;
                  return db.collection("art").findOne({
                    title: it?.prfnm[0],
                    startDate: it?.prfpdfrom[0].replace(/\./g, ""),
                  });
                })
                .then((data) => {
                  if (data) {
                    throw new Error("이미 저장된 공연 정보입니다.");
                  }
                  return db.collection("art").insertOne({
                    _id: id + 1,
                    title: it?.prfnm[0],
                    startDate: it?.prfpdfrom[0].replace(/\./g, ""),
                    endDate: it?.prfpdto[0].replace(/\./g, ""),
                    img: it?.poster[0].replace(/^http(?!s)/, "https"),
                    location: it?.fcltynm[0],
                    cate: it?.genrenm[0],
                    address: address,
                  });
                })
                .then(
                  (data) => {
                    db.collection("counter").updateOne(
                      { name: "artId" },
                      { $inc: { id: 1 } }
                    );
                    console.log(id);
                  },
                  (err) => {
                    console.log(err.message);
                  }
                );
            }
          });
        });
    }
  );
};

const getPlaceCode = (place_name) => {
  return fetch(
    `http://www.kopis.or.kr/openApi/restful/prfplc?service=${process.env.KOPIS_API}&cpage=1&rows=5&shprfnmfct=${place_name}`,
    {
      method: "GET",
    }
  )
    .then((response) =>
      // xml 형식을 json 형식으로 변환
      response.text()
    )
    .then(async (data) => {
      let res;
      await parseString(data, function (err, result) {
        res = addAddress(result.dbs?.db[0]?.mt10id[0]);
      });
      return res;
    });
};

const addAddress = (code) => {
  return fetch(
    `http://www.kopis.or.kr/openApi/restful/prfplc/${code}?service=${process.env.KOPIS_API}`,

    {
      method: "GET",
    }
  )
    .then((response) =>
      // xml 형식을 json 형식으로 변환
      response.text()
    )
    .then(async (data) => {
      let result;
      await parseString(data, (err, res) => {
        result = res?.dbs.db[0].adres[0];
      });
      return result;
    });
};

updateArt(20230911, 20231010);
