let router = require("express").Router();

// ================ 좋아요 추가 =====================

router.post("/add", (req, response) => {
  let db = req.db;
  db.collection("counter").findOne({ name: "likeId" }, (err, result) => {
    if (err) return console.log("counter db 연결 에러");
    db.collection("like").insertOne(
      {
        ...req.body,
        isLike: true,
        _id: result.id + 1,
      },
      () => {
        db.collection("counter").updateOne(
          { name: "likeId" },
          { $inc: { id: 1 } }
        );
      }
    );
  });
  response.status(200).send();
});

// ================ 좋아요 삭제 =====================

router.delete("/delete/:address", (req, response) => {
  let db = req.db;
  db.collection("like").deleteOne(
    { road_address_name: req.params.address, uuid: req.headers.uuid },
    (err, result) => {
      if (result.deletedCount === 0) {
        return response.status(404).send("삭제 실패");
      }
      response.status(200).send("삭제 성공");
    }
  );
});

// ================ 좋아요 조회 =====================

router.get("/get", (req, response) => {
  let db = req.db;
  db.collection("like")
    .find({ uuid: req.header("uuid") })
    .toArray((err, result) => {
      if (!result) return response.status(404).send();
      response.status(200).send(result);
    });
});

module.exports = router;
