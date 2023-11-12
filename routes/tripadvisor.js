var express = require("express");
var router = express.Router();
const axios = require("axios");

/* GET home page. */
router.get("/", function (req, res, next) {
  axios
    .get(
      `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIP_ADVISOR_KEY}&searchQuery=orlando&category=hotels&latLong=28.3606/-81.428453&radius=5000`
    )
    .then((results) => {
      console.log(results.data);
      const hotels = results.data.data;
      //   console.log(hotels.data);
      //   console.log(hotels, "hotels");
      const hotelsWithPhotos = hotels.map((hotel) => {
        return axios
          .get(
            `https://api.content.tripadvisor.com/api/v1/location/${hotel.location_id}/photos?language=en&key=${process.env.TRIP_ADVISOR_KEY}`
          )
          .then((photo) => {
            console.log(photo, "photo");
            return {
              ...photo.data,
              name: hotel.name,
              address: hotel.address_obj,
            };
          });
      });
      //   console.log(hotelsWithPhotos, "yea");
      return Promise.all(hotelsWithPhotos);

      //   return Promise.all(hotelsWithPhotos);
      //   res.json(hotels);
    })
    .then((hotelsWithPhotos) => {
      console.log(hotelsWithPhotos, "hi");

      const hotelArray = hotelsWithPhotos.map((hotel) => {
        return { data: hotel.data, name: hotel.name, address: hotel.address };
      });

      res.json({ hotels: hotelArray });
    })
    .catch((err) => {
      console.log(err);
    });
  //   const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIP_ADVISOR_KEY}&searchQuery=orlando`;
  //   const options = { method: "GET", headers: { accept: "application/json" } };

  //   fetch(url, options)
  //     .then((res) => res.json())
  //     .then((json) => {
  //       res.json(json);

  //       console.log(json);
  //     })
  //     .catch((err) => console.error("error:" + err));
});

module.exports = router;
