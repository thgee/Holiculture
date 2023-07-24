let router = require("express").Router();
const { v4: uuidv4 } = require("uuid"); // uuid

router.get("/", (req, res) => {
  const userUUID = uuidv4();
  res.json({ uuid: userUUID });
});

module.exports = router;
