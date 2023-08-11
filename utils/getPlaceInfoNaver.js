const getPlaceInfoNaver = (place) => {
  return fetch(
    `https://map.naver.com/v5/api/search?query=${place.place_name}&type=all&searchCoord=${place.x};${place.y}&page=1&displayCount=1`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.result?.place);
      return data.result?.place?.list[0]?.id;
    })
    .then((id) =>
      fetch(`https://map.naver.com/v5/api/sites/summary/${id}?lang=ko`, {
        method: "GET",
      })
    )
    .then((res) => res.json())
    .then((placeInfo) => {
      return placeInfo;
    });
};

module.exports = getPlaceInfoNaver;
