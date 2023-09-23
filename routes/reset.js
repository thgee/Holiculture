const router = require("express").Router();

router.post("/", async (req, response) => {
  let db = req.db;
  try {
    await db.collection("ticket").deleteMany({ uuid: req.body.uuid });
    await db.collection("like").deleteMany({ uuid: req.body.uuid });
    response.status(200).send("데이터 삭제 완료");
  } catch (err) {
    response.status(500).send(err.message);
  }
});

module.exports = router;
