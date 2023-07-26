const router = require("express").Router();
let db;

router.use((req, res, next) => {
  db = req.db;
  next();
});

// ================== 게시글 추가 ==================

router.post("/add", (req, response) => {
  db.collection("counter").findOne({ name: "postId" }, (err, result) => {
    try {
      if (err) {
        throw new Error("Error finding postId counter");
      }

      if (!result) {
        throw new Error("postId counter not found");
      }

      db.collection("board").insertOne(
        { _id: result.id + 1, commentCounter: 0, ...req.body },
        (err, result) => {
          if (err) {
            throw new Error("Error adding new post");
          }

          db.collection("counter").updateOne(
            { name: "postId" },
            { $inc: { id: 1 } },
            (err, result) => {
              if (err) {
                throw new Error("Error updating postId counter");
              }

              response.status(200).send();
            }
          );
        }
      );
    } catch (err) {
      console.error(err.message);
      response.status(500).send("Internal Server Error");
    }
  });
});

// ================== 게시물 삭제 ==================
// 게시물의 댓글도 모두 삭제시켜야 함

router.delete("/delete/:postId", (req, response) => {
  db.collection("comment")
    .deleteMany({ fk: parseInt(req.params.postId) })
    .then((res) => {
      db.collection("board").deleteOne(
        { _id: parseInt(req.params.postId) },
        (err, result) => {
          if (err) throw new Error("board db 연결 실패");
          if (result.deletedCount === 0)
            response.status(404).send("존재하지 않는 게시물");
          response.status(200).send();
        }
      );
    })
    .catch((err) => {
      console.log(err.message);
      response.status(500).send("Internal Server Error");
    });
});

// ================== 게시물 조회 ==================

router.get("/get", (req, response) => {
  try {
    db.collection("board")
      .find({ address: req.query.address })
      .toArray((err, result) => {
        if (err) throw new Error("board db 연결 실패");
        response.status(200).send(result);
      });
  } catch (err) {
    console.error(err.message);
    response.status(500).send("Internal Server Error");
  }
});

module.exports = router;
