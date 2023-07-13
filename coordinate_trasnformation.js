var proj4 = require("proj4");

//UTM-K 좌표계
var eps2097 =
  "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs";
//wgs84(위경도)좌표계
var wgs84 =
  "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees";

// 내가 임의로 설정한 보정계수
let CorrectionX = 0.00189998527463;
let CorrectionY = 0.0005514481738;

var eps2097p = proj4(eps2097, wgs84, [207333.6398, 451464.2671]);
console.log(eps2097p[1] + CorrectionX, eps2097p[0] + CorrectionY);
