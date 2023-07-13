const express = require("express");
const app = express();
app.use("/public", express.static("public"));

app.listen(8080, function () {
  console.log(
    "===================\n=====서버실행======\n===================\n"
  );

  // -----------------------  xlsx 읽기 ------------------------------
  const xlsx = require("xlsx");
  const excelFile = xlsx.readFile(__dirname + "/public/restaurant_list.xlsx");
  const sheetName = excelFile.SheetNames[0];
  const firstSheet = excelFile.Sheets[sheetName];
  const restaurantList = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });
  console.log(restaurantList[100].사업장명);
});
