const express = require("express");
const app = express();
app.use("/public", express.static("public"));

// app.listen(8080, function () {
//   console.log(
//     "===================\n=====서버실행======\n===================\n"
//   );
// });

const csv = require("csv-parser");
const fs = require("fs");
const results = [];

fs.createReadStream(__dirname + "/public/restaurant_list.csv")
  .pipe(
    csv({
      mapHeaders: ({ header }) => header.trim(),
    })
  )
  .on("data", (data) => results.push(data))
  .on("end", () => {
    console.log(results);
  });
