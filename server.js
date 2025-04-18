const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Directories
const publicDir = path.join(__dirname, 'public');
const photosDir = path.join(__dirname, 'photos');

// Ensure directories exist
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
if (!fs.existsSync(photosDir)) fs.mkdirSync(photosDir);

// Middleware
app.use(express.static(publicDir));               // Serve frontend assets
app.use('/photos', express.static(photosDir));    // Serve saved images
app.use(express.json({ limit: '10mb' }));         // Parse JSON bodies

// Routes
// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to receive location data
app.post('/api/location', (req, res) => {
  const { latitude, longitude, timestamp } = req.body;

  // TODO: Store the data in your database
  console.log(`Received location: ${latitude}, ${longitude} at ${timestamp}`);

  res.status(200).send('Location data received.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


// Log endpoint: save geo + image
app.post('/log', (req, res) => {
  const { latitude, longitude, accuracy, photo, timestamp } = req.body;
  const filename = `${timestamp.replace(/[:.]/g, '-')}.png`;
  const filePath = path.join(photosDir, filename);

  // Save image base64→PNG
  const base64Data = photo.replace(/^data:image\/[a-z]+;base64,/, '');
  fs.writeFileSync(filePath, base64Data, 'base64');

  // Append to CSV log
  const logEntry = `${timestamp},${latitude},${longitude},${accuracy},${filename}\n`;
  fs.appendFileSync(path.join(__dirname, 'log.csv'), logEntry);

  res.sendStatus(200);
});

// Gallery: dynamic HTML listing of photos
app.get('/gallery', (req, res) => {
  fs.readdir(photosDir, (err, files) => {
    if (err) return res.status(500).send('Failed to load gallery');

    const images = files
      .filter(f => f.toLowerCase().endsWith('.png'))
      .sort((a, b) => b.localeCompare(a));

    let html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Gallery</title>
<style>body{font-family:sans-serif;text-align:center;}img{margin:10px;border:1px solid #ccc;}a{color:#007acc;text-decoration:none;}</style>
</head><body>
<h1>Captured Photos</h1>
`;

    images.forEach(file => {
      html += `
<div style="display:inline-block;">
  <a href="/photos/${file}" target="_blank">
    <img src="/photos/${file}" width="150">
  </a>
  <div><small>${file}</small></div>
</div>
`;
    });

    html += `
<p><a href="/">Back to Tracker</a></p>
</body></html>`;
    res.send(html);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
