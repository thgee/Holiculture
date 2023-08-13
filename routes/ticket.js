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
            ...req.body,
            _id: result.id + 1,
            posX: data.documents[0]?.x,
            posY: data.documents[0]?.y,
          },
          (err, res) => {
            if (err) return response.status(400).send("중복된 id");
            db.collection("counter").updateOne(
              { name: "ticketId" },
              { $inc: { id: 1 } }
            );
            response.status(200).send("티켓 등록 완료");
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
      console.log(result);
      if (result.deletedCount === 0) {
        return response.status(404).send("존재하지 않는 티켓입니다");
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

// ================ 티켓수정 =====================

router.put("/edit/:id", (req, response) => {
  let db = req.db;

  // 스위프트에서 _id를 또 넘겨줄 것이라, _id값의 재선언을 피하기 위해 추가함
  delete req.body._id;

  db.collection("ticket").updateOne(
    { _id: parseInt(req.params.id) },
    { $set: { ...req.body } },
    (err, result) => {
      try {
        if (err) response.status(500).send("인터넷 오류");

        if (result?.matchedCount === 0)
          response.status(404).send("티켓을 찾을 수 없음");

        if (result?.matchedCount === 1)
          response.status(200).send("티켓 수정 완료");
      } catch (err) {
        console.log(err.message);
      }
    }
  );
});

module.exports = router;
