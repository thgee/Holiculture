const router = require("express").Router();
const getArtKopis = require("../utils/getArtKopis");

router.get("/", (req, response) => {
  getArtKopis(req.query.date).then((arts) => {
    let result = arts?.map((it) => {
      return {
        title: it?.prfnm[0],
        date: req?.query.date,
        img: it?.poster[0],
        location: it?.fcltynm[0],
        cate: it?.genrenm[0],
        state: it?.prfstate[0],
      };
    });

    response.status(200).send(result);
  });
});

module.exports = router;
