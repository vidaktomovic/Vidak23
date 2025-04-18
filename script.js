const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
const publicDir = path.join(__dirname, 'public');
const photosDir = path.join(__dirname, 'photos');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir);

// Serve static files
app.use(express.static(publicDir));
app.use('/photos', express.static(photosDir));
app.use(express.json({ limit: '10mb' }));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Handle log POST
app.post('/log', (req, res) => {
  const { latitude, longitude, accuracy, photo, timestamp } = req.body;
  const filename = `photos/${timestamp.replace(/[:.]/g, '-')}.png`;
  const base64Data = photo.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(path.join(__dirname, filename), base64Data, 'base64');
  const logEntry = `${timestamp},${latitude},${longitude},${accuracy},${filename}\n`;
  fs.appendFileSync('log.csv', logEntry);
  res.status(200).send('Logged');
});

// Serve log.csv
app.get('/log.csv', (req, res) => {
  const logPath = path.join(__dirname, 'log.csv');
  if (fs.existsSync(logPath)) {
    res.sendFile(logPath);
  } else {
    res.status(404).send('Log file not found.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
