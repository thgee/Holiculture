const router = require("express").Router();
let db;

router.use((req, res, next) => {
  db = req.db;
  next();
});

// ================== 댓글 추가 ==================

router.post("/add/:postId", (req, response) => {
  db.collection("counter").findOne(
    { name: "commentId" },
    (err, result_counter) => {
      try {
        if (err) {
          throw new Error("db 연결 오류");
        }
        db.collection("board").findOne(
          { _id: parseInt(req.params.postId) },
          (err, result_post) => {
            if (!result_post)
              return response.status(404).send("없는 게시물에 접근");
            db.collection("comment").insertOne(
              {
                _id: result_counter.id + 1,
                fk: parseInt(req.params.postId),
                num: parseInt(result_post?.commentCounter + 1),
                ...req.body,
              },
              (err, result) => {
                if (err) throw new Error("중복된 id");

                db.collection("board").updateOne(
                  { _id: parseInt(req.params.postId) },
                  { $inc: { commentCounter: 1 } }
                );

                db.collection("counter").updateOne(
                  { name: "commentId" },
                  { $inc: { id: 1 } },
                  (err, result) => {
                    if (err) throw err;

                    response.status(200).send();
                  }
                );
              }
            );
          }
        );
      } catch (err) {
        console.error(err.message);
        response.status(500).send("Internal Server Error");
      }
    }
  );
});

// ================== 댓글 삭제 ==================

router.delete(
  "/delete/:commentId",

  // 삭제하는 자와 댓글 작성자가 일치하는지 확인하는 미들웨어
  (req, response, next) => {
    db.collection("comment")
      .findOne({
        _id: parseInt(req.params.commentId),
      })
      .then(
        (result) => {
          if (!result) return response.status(404).send("존재하지 않는 댓글");
          else if (result?.uuid === req.body?.uuid) next();
          else response.status(403).send("작성자가 아닌 유저가 삭제를 시도함");
        },
        (err) => response.status(500).send("Internal Server Error")
      );
  },

  (req, response) => {
    try {
      db.collection("comment").deleteOne(
        { _id: parseInt(req.params.commentId) },
        (err, result) => {
          if (err) throw new Error("db 연결 실패");
          response.status(200).send("삭제 성공");
        }
      );
    } catch (err) {
      console.log(err.message);
      response.status(500).send("Internal Server Error");
    }
  }
);

// ================== 댓글 조회 ==================

router.get("/get/:postId", (req, response) => {
  try {
    db.collection("comment")
      .find({ fk: parseInt(req.params.postId) })
      .toArray((err, result) => {
        if (err) throw new Error("db 연결 실패");
        response.status(200).send(result);
      });
  } catch (err) {
    console.error(err.message);
    response.status(500).send("Internal Server Error");
  }
});

module.exports = router;
