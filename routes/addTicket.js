let router = require("express").Router();

router.post("/", (req, response) => {
  let db = req.db;
  db.collection("counter").findOne({ name: "ticketId" }, (err, result) => {
    db.collection("ticket").insertOne(
      { _id: result.id + 1, ...req.body },
      () => {
        db.collection("counter").updateOne(
          { name: "ticketId" },
          { $inc: { id: 1 } }
        );
        console.log(req.body);
      }
    );
  });
  response.status(200).send();
});

module.exports = router;
