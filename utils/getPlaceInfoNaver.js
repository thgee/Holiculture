const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getPlaceInfoNaver = async (place) => {
  const trimmed_place_name = place.place_name.replace(/\s+$/, "").split(" ")[0];
  await delay(1220);
  return fetch(
    `https://map.naver.com/v5/api/search?query=${trimmed_place_name}&type=all&searchCoord=${place.x};${place.y}&page=1&displayCount=1`,
    {
      method: "GET",
      headers: {
        Referer: "https://map.naver.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data.result?.place?.list[0]?.id;
    })
    .then(async (id) => {
      await delay(1220);
      return fetch(`https://map.naver.com/v5/api/sites/summary/${id}?lang=ko`, {
        method: "GET",
        headers: {
          Referer: "https://map.naver.com/",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        },
      });
    })
    .then((res) => res.json())
    .then((placeInfo) => {
      return placeInfo;
    });
};

module.exports = getPlaceInfoNaver;
