const axios = require("axios");

// 12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점
const tourApi = (ticket, distance, page) => {
  if (page >= 20) return [];
  return axios(
    `http://apis.data.go.kr/B551011/KorService1/locationBasedList1`,
    {
      params: {
        _type: "json",
        serviceKey: process.env.TOUR_API,
        MobileOS: "ETC",
        MobileApp: "holiculture",
        mapX: ticket?.posX,
        mapY: ticket?.posY,
        radius: distance,
        arrange: "R",
        numOfRows: 10,
        pageNo: parseInt(page),
      },
    }
  )
    .then(({ data }) => {
      return data.response.body.items.item;
    })
    .catch((err) => {
      return err;
    });
};

module.exports = tourApi;
