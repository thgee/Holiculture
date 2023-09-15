const express = require("express");
const tourApi = require("./utils/tourApi");
const app = express();
const MongoClient = require("mongodb").MongoClient; // 몽고db 연결
require("dotenv").config(); // 환경변수

app.use(express.urlencoded({ extended: true })); // x-xxx-form-urlencoded post 요청 가능하게 함
app.use(express.json()); // json형식 post요청 가능하게 함

// ================ DB 연결 ==================
let db;
MongoClient.connect(
  process.env.MONGODB_URL,
  { useUnifiedTopology: true },
  function (err, client) {
    if (err) return console.log(err);
    db = client.db("Holliculture");
    // ====================== 서버실행 =================
    app.listen(8080, () => {
      console.log(
        "서버실행 ============================================================================="
      );
    });
  }
);
// 몽고 DB 객체를 미들웨어로 전달
app.use((req, res, next) => {
  req.db = db; // req 객체에 db를 저장하여 다른 라우트에서 사용할 수 있도록 함
  next();
});

//  ================ 라우팅 ================
app.use("/ticket", require("./routes/ticket"));
app.use("/uuid", require("./routes/getuuid"));
app.use("/food", require("./routes/food"));
app.use("/room", require("./routes/room"));
app.use("/play", require("./routes/play"));
app.use("/like", require("./routes/like"));
app.use("/board", require("./routes/board"));
app.use("/comment", require("./routes/comment"));
app.use("/art", require("./routes/getArt"));
