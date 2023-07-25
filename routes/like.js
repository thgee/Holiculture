let router = require("express").Router();

// ================ 좋아요 추가 =====================

router.post("/add", (req, response) => {
  let db = req.db;
  db.collection("counter").findOne({ name: "likeId" }, (err, result) => {
    if (err) return console.log("counter db 연결 에러");
    db.collection("like").insertOne(
      {
        _id: result.id + 1,
        ...req.body,
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

router.delete("/delete/:likeId", (req, response) => {
  let db = req.db;
  db.collection("like").deleteOne(
    { _id: parseInt(req.params.likeId) },
    (err, result) => {
      if (result.deletedCount === 0) {
        return response.status(404).send();
      }
      response.status(200).send();
    }
  );
});

// ================ 좋아요 조회 =====================

router.get("/get", (req, response) => {
  let db = req.db;
  db.collection("like")
    .find({ uuid: req.body.uuid })
    .toArray((err, result) => {
      if (!result) return response.status(404).send();
      response.status(200).send(result);
    });
});

module.exports = router;
