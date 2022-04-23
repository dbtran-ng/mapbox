const asyncRequest = require('async-request');

const ACCESS_KEY =
  'pk.eyJ1IjoiZGJ0cmFubmciLCJhIjoiY2wyYmwyYXhhMDVmbDNjc2ZtM3R3ZWNtOSJ9.fWD56B-NKiyrJK2rkTf8iA';

const getPlaceName = async (location) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?types=place&access_token=${ACCESS_KEY}`;

  try {
    const res = await asyncRequest(url);
    const data = JSON.parse(res.body);
    const place = {
      isSuccess: true,
      place_name: data.features[0].place_name,
      center: data.features[0].center,
    };
    return place;
  } catch (err) {
    console.error(err);
    return {
      isSuccess: false,
      err,
    };
  }
};
getPlaceName();

const express = require('express');
const app = express();
const path = require('path');
const pathPublic = path.join(__dirname, './public');

app.use(express.static(pathPublic));
app.get('/', async (req, res) => {
  const params = req.query;
  const location = params.address;
  const place = await getPlaceName(location);
  if (place.isSuccess) {
    res.render('main', {
      status: true,
      place_name: place.place_name,
      center: place.center,
      long: place.center[0],
      lat: place.center[1],
    });
  } else {
    res.render('weather', {
      status: false,
    });
  }
});

app.set('view engine', 'hbs');

const port = 7000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
