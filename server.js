const express = require("express");
const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================ DB 연결 ==================
let db;
MongoClient.connect(process.env.MONGODB_URL, function (err, client) {
  if (err) return console.log(err);
  db = client.db("Holliculture");
});

// 몽고 DB 객체를 미들웨어로 전달
app.use((req, res, next) => {
  req.db = db; // req 객체에 db를 저장하여 다른 라우트에서 사용할 수 있도록 함
  next();
});

//  ================ 라우팅 ================
app.use("/ticket", require("./routes/ticket"));
// app.use("/food", require("./routes/food.js"));

app.listen(8080, () => {
  console.log(
    "서버실행 ============================================================================="
  );
});
