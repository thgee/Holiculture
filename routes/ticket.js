let router = require("express").Router();

// ================ 티켓등록 =====================
router.post("/add", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db
  db.collection("counter").findOne({ name: "ticketId" }, (err, result) => {
    db.collection("ticket").insertOne(
      { _id: result.id + 1, ...req.body },
      () => {
        db.collection("counter").updateOne(
          { name: "ticketId" },
          { $inc: { id: 1 } }
        );
      }
    );
  });
  response.status(200).send();
});

// ================ 티켓삭제 =====================

router.delete("/delete", (req, response) => {
  let db = req.db; // server.js 에서 넘겨준 db
  db.collection("ticket").deleteOne(
    { _id: parseInt(req.body.ticketId) },
    (err, result) => {
      if (result.deletedCount === 0) {
        return response
          .status(404)
          .json({ error: "해당 티켓을 찾을 수 없습니다." });
      }
      response.status(200).send();
    }
  );
});

module.exports = router;
