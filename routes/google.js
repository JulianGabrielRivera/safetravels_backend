const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async function (req, res, next) {
  try {
    const photos = [];

    const results = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=cruise&location=${req.body.lat}%2C${req.body.lng}&radius=7000&type=restaurant&key=${process.env.Google_key}`
    );

    const names = await results.data.results.map((name) => {
      return name.name;
    });

    const userRatings = await results.data.results.map((ratings) => {
      return ratings.user_ratings_total;
    });
    const overallRating = await results.data.results.map((ratings) => {
      return ratings.rating;
    });
    console.log(userRatings, overallRating);
    console.log(names);
    const photoPromises = [];

    results.data.results.forEach((place) => {
      place.photos.forEach((photo) => {
        const photoPromise = axios.get(
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${process.env.Google_key}`
        );

        photoPromises.push(photoPromise);
      });
    });

    const photoResponses = await Promise.all(photoPromises);
    // console.log(photoResponses, "hi");
    photoResponses.forEach((result) => {
      photos.push(result.config.url);
    });

    // Send the collected photos as a JSON response
    res.json({
      photos: photos,
      names: names,
      userRatings: userRatings,
      overallRating: overallRating,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/cafe", async function (req, res, next) {
  try {
    const photos = [];
    const results = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=cafe&location=${req.body.lat}%2C${req.body.lng}&radius=7000&type=food&key=${process.env.Google_key}`
    );
    // const filtered = results.data.results.filter((restaurant) =>
    //   restaurant.photos[0].length > 0 ? restaurant.photos[0] : ""
    // );

    results.data.results.forEach((restaurant) => {
      //   console.log(restaurant.photos[0].photo_reference);
      if (restaurant.photos === undefined) {
        return;
      }
      const photoRef = axios.get(
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.photos[0].photo_reference}&key=${process.env.Google_key}`
      );

      photos.push(photoRef);
    });

    const photoPromises = await Promise.all(photos);
    // console.log(filtered);
    // console.log(photoPromises);
    photoPromises.forEach((result) => {
      //   console.log(result);
      photos.push(result.config.url);
    });
    // console.log(photos);
    const cafeNames = await results.data.results.map((cafeSpot) => {
      return {
        name: cafeSpot.name,
        // open: cafeSpot.opening_hours.open_now,
        icon: cafeSpot.icon,
        rating: cafeSpot.rating,
        vicinity: cafeSpot.vicinity,
      };
    });
    console.log(cafeNames);
    res.json({ photos: photos, cafeNames: cafeNames });
    // console.log(photoReference);
    // console.log(results.data.results);
  } catch (err) {
    console.log(err);
  }
});
router.post("/gym", async function (req, res, next) {
  try {
    const photos = [];
    const results = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=gym&location=${req.body.lat}%2C${req.body.lng}&radius=7000&type=gym&key=${process.env.Google_key}`
    );
    // const filtered = results.data.results.filter((restaurant) =>
    //   restaurant.photos[0].length > 0 ? restaurant.photos[0] : ""
    // );
    console.log(results);
    results.data.results.forEach((gym) => {
      //   console.log(gym.photos[0].photo_reference);
      if (gym.photos === undefined) {
        return;
      }
      const photoRef = axios.get(
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${restaurant.photos[0].photo_reference}&key=${process.env.Google_key}`
      );

      photos.push(photoRef);
    });

    const photoPromises = await Promise.all(photos);
    // console.log(filtered);
    // console.log(photoPromises);
    photoPromises.forEach((result) => {
      //   console.log(result);
      photos.push(result.config.url);
    });
    // console.log(photos);
    const gymNames = await results.data.results.map((gymSpot) => {
      return {
        name: gymSpot.name,
        // open: gymSpot.opening_hours.open_now,
        icon: gymSpot.icon,
        rating: gymSpot.rating,
        vicinity: gymSpot.vicinity,
      };
    });
    console.log(gymNames);
    res.json({ photos: photos, gymNames: gymNames });
    // console.log(photoReference);
    // console.log(results.data.results);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
