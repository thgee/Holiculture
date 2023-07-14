const express = require("express");
const app = express();
app.use("/public", express.static("public"));

var proj4 = require("proj4");

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
    // ---------------- 좌표 변환 --------------------

    var epgs2097 =
      "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43";
    var wgs84 =
      "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";

    let epgs2097Pos;
    for (let i = 0; i < results.length; i++) {
      if (results[i].num == 100091) {
        epgs2097Pos = [results[i].X, results[i].Y];
        console.log(results[i]);
      }
    }
    var wgs84Pos = proj4(epgs2097, wgs84, [
      parseInt(epgs2097Pos[0]),
      parseInt(epgs2097Pos[1]),
    ]);

    console.log(wgs84Pos[1], wgs84Pos[0]);
  });
