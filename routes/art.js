const router = require("express").Router();

router.get("/", (req, response) => {
  var regex = /(\d{4})\.(\d{2})\.(\d{2})/;
  var match = regex.exec(req.query.date);
  var trimmedDate = match ? match[1] + match[2] + match[3] : null;

  let db = req.db;
  db.collection("art")

    .find({
      startDate: { $lte: trimmedDate },
      endDate: { $gte: trimmedDate },
    })
    .toArray((err, res) => {
      if (err) throw err;

      response.status(200).send(res);
    });
});

module.exports = router;
