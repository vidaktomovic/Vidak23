// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
    const video = document.getElementById('video');
    video.srcObject = stream;
  })
  .catch(function(err) {
    console.error("Error accessing camera: " + err);
  });

// Capture photo and get GPS location
document.getElementById('capture').addEventListener('click', function() {
  const canvas = document.getElementById('canvas');
  const video = document.getElementById('video');
  const photo = document.getElementById('photo');
  const locationDisplay = document.getElementById('location');

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the current frame from the video onto the canvas
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the canvas image to a data URL and display it
  const imageData = canvas.toDataURL('image/png');
  photo.src = imageData;

  // Get GPS location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude.toFixed(6);
      const longitude = position.coords.longitude.toFixed(6);
      locationDisplay.textContent = `Location: ${latitude}, ${longitude}`;

      // Here you can send the imageData and GPS coordinates to your server or save them as needed
      // Example: sendToServer(imageData, latitude, longitude);
    }, function(error) {
      locationDisplay.textContent = "Location: Unable to retrieve location.";
      console.error("Geolocation error: " + error.message);
    });
  } else {
    locationDisplay.textContent = "Location: Geolocation not supported.";
  }
});
