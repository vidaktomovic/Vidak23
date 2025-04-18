const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/geolocationDB', { useNewUrlParser: true, useUnifiedTopology: true });

const locationSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  timestamp: Date
});

const Location = mongoose.model('Location', locationSchema);

// Inside your POST handler
const newLocation = new Location({ latitude, longitude, timestamp });
newLocation.save()
  .then(() => res.status(200).send('Location data saved.'))
  .catch(err => res.status(500).send('Error saving location data.'));

// functions/saveData.js
exports.handler = async (event, context) => {
  const { latitude, longitude, photo } = JSON.parse(event.body);

  // Process the data (e.g., save to a database or perform other actions)
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Photo: ${photo}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Data saved successfully!' }),
  };
};

