let router = require("express").Router();

// ================ 티켓등록 =====================

router.post("/add", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db
  db.collection("counter").findOne({ name: "ticketId" }, (err, result) => {
    if (err) return console.log("counter db 연결 에러");
    // 도로명주소를 좌표로 변환하여 공연장의 좌표까지 티켓 컬렉션에 저장
    fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&page=1&size=10&query=${req.body.address}`,
      {
        method: "GET",
        headers: { Authorization: process.env.KAKAO_API },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        db.collection("ticket").insertOne(
          {
            _id: result.id + 1,
            ...req.body,
            posX: data.documents[0]?.x,
            posY: data.documents[0]?.y,
          },
          () => {
            db.collection("counter").updateOne(
              { name: "ticketId" },
              { $inc: { id: 1 } }
            );
            response.status(200).send("complete");
          }
        );
      });
  });
});

// ================ 티켓삭제 =====================

router.delete("/delete/:ticketId", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db
  db.collection("ticket").deleteOne(
    { _id: parseInt(req.params.ticketId) },
    (err, result) => {
      if (result.deletedCount === 0) {
        return response.status(404).send();
      }
      response.status(200).send();
    }
  );
});

// ================ 티켓조회 =====================

router.get("/get", (req, response) => {
  let db = req.db;
  db.collection("ticket")
    .find({ uuid: req.header("uuid") })
    .toArray((err, result) => {
      console.log(result);
      if (result.length === 0) return response.status(404).send("티켓없음");
      response.status(200).send(result);
    });
});

module.exports = router;
