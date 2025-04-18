const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Ensure directories exist
if (!fs.existsSync(path.join(__dirname, 'public'))) fs.mkdirSync(path.join(__dirname, 'public'));
if (!fs.existsSync(path.join(__dirname, 'photos'))) fs.mkdirSync(path.join(__dirname, 'photos'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '10mb' }));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle log POST
app.post('/log', (req, res) => {
  const { latitude, longitude, accuracy, photo, timestamp } = req.body;
  const filename = `photos/${timestamp.replace(/[:.]/g, '-')}.png`;
  const base64Data = photo.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(filename, base64Data, 'base64');
  const logEntry = `${timestamp},${latitude},${longitude},${accuracy},${filename}\n`;
  fs.appendFileSync('log.csv', logEntry);
  res.status(200).send('Logged');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
