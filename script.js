const video = document.getElementById('video');
const capturedPhoto = document.getElementById('captured-photo');
const continueButton = document.getElementById('continue-button');
const publicGalleryButton = document.getElementById('public-gallery-button');
const locationData = document.getElementById('location-data');
const gallery = document.getElementById('gallery');
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    (error) => {
      console.error('Error obtaining location:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
} else {
  console.error('Geolocation is not supported by this browser.');
}

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error accessing camera: ", err);
  });
const video = document.getElementById('video');
const capturedPhoto = document.getElementById('captured-photo');
const continueButton = document.getElementById('continue-button');
const publicGalleryButton = document.getElementById('public-gallery-button');
const locationData = document.getElementById('location-data');
const gallery = document.getElementById('gallery');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error accessing camera: ", err);
  });

// Function to capture photo and get location
function capturePhotoAndLocation() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');

  // Display captured photo
  capturedPhoto.src = imageData;
  capturedPhoto.style.display = 'block';
  video.style.display = 'none';

  // Get GPS location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude.toFixed(6);
      const longitude = position.coords.longitude.toFixed(6);
      locationData.textContent = `Location: ${latitude}, ${longitude}`;

      // Send photo and location to the server
      fetch('upload.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: imageData,
          latitude: latitude,
          longitude: longitude
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        displayGallery();
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    }, error => {
      locationData.textContent = "Unable to retrieve location.";
      console.error("Geolocation error: ", error);
    });
  } else {
    locationData.textContent = "Geolocation not supported.";
  }
}

// Display gallery photos
function displayGallery() {
  gallery.innerHTML = '';
  fetch('gallery.php')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const img = document.createElement('img');
        img.src = 'data:image/png;base64,' + item.image;
        img.alt = `Photo taken at ${item.latitude}, ${item.longitude}`;
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.appendChild(img);
        gallery.appendChild(div);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
const video = document.getElementById('video');
const capturedPhoto = document.getElementById('captured-photo');
const continueButton = document.getElementById('continue-button');
const publicGalleryButton = document.getElementById('public-gallery-button');
const locationData = document.getElementById('location-data');
const gallery = document.getElementById('gallery');

// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error accessing camera: ", err);
  });

// Function to capture photo and get location
function capturePhotoAndLocation() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');

  // Display captured photo
  capturedPhoto.src = imageData;
  capturedPhoto.style.display = 'block';
  video.style.display = 'none';

  // Get GPS location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude.toFixed(6);
      const longitude = position.coords.longitude.toFixed(6);
      locationData.textContent = `Location: ${latitude}, ${longitude}`;

      // Save photo and location to localStorage
      const photoData = {
        image: imageData,
        lat: latitude,
        lon: longitude,
        timestamp: new Date().toISOString()
      };
      saveToLocalStorage(photoData);
    }, error => {
      locationData.textContent = "Unable to retrieve location.";
      console.error("Geolocation error: ", error);
    });
  } else {
    locationData.textContent = "Geolocation not supported.";
  }
}

// Save photo data to localStorage
function saveToLocalStorage(photoData) {
  let photoGallery = JSON.parse(localStorage.getItem('photoGallery')) || [];
  photoGallery.push(photoData);
  localStorage.setItem('photoGallery', JSON.stringify(photoGallery));
  displayGallery();
}

// Display gallery photos
function displayGallery() {
  gallery.innerHTML = '';
  const photoGallery = JSON.parse(localStorage.getItem('photoGallery')) || [];
  photoGallery.forEach(item => {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = `Photo taken at ${item.lat}, ${item.lon}`;
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.appendChild(img);
    gallery.appendChild(div);
  });
}

// Event listeners
continueButton.addEventListener('click', capturePhotoAndLocation);

publicGalleryButton.addEventListener('click', () => {
  // Display only images without location data
  gallery.innerHTML = '';
  const photoGallery = JSON.parse(localStorage.getItem('photoGallery')) || [];
  photoGallery.forEach(item => {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = 'Public Photo';
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.appendChild(img);
    gallery.appendChild(div);
  });
});

// Initialize gallery on page load
window.onload = displayGallery;

// Event listeners
continueButton.addEventListener('click', capturePhotoAndLocation);

publicGalleryButton.addEventListener('click', () => {
  // Display only images without location data
  gallery.innerHTML = '';
  fetch('public_gallery.php')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        const img = document.createElement('img');
        img.src = 'data:image/png;base64,' + item.image;
        img.alt = 'Public Photo';
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.appendChild(img);
        gallery.appendChild(div);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});

// Initialize gallery on page load
window.onload = displayGallery;

// Function to capture photo and get location
function capturePhotoAndLocation() {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/png');

  // Display captured photo
  capturedPhoto.src = imageData;
  capturedPhoto.style.display = 'block';
  video.style.display = 'none';

  // Get GPS location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude.toFixed(6);
      const longitude = position.coords.longitude.toFixed(6);
      locationData.textContent = `Location: ${latitude}, ${longitude}`;

      // Save photo and location to localStorage
      const photoData = {
        image: imageData,
        lat: latitude,
        lon: longitude,
        timestamp: new Date().toISOString()
      };
      saveToLocalStorage(photoData);
    }, error => {
      locationData.textContent = "Unable to retrieve location.";
      console.error("Geolocation error: ", error);
    });
  } else {
    locationData.textContent = "Geolocation not supported.";
  }
}

// Save photo data to localStorage
function saveToLocalStorage(photoData) {
  let photoGallery = JSON.parse(localStorage.getItem('photoGallery')) || [];
  photoGallery.push(photoData);
  localStorage.setItem('photoGallery', JSON.stringify(photoGallery));
  displayGallery();
}

// Display gallery photos
function displayGallery() {
  gallery.innerHTML = '';
  const photoGallery = JSON.parse(localStorage.getItem('photoGallery')) || [];
  photoGallery.forEach(item => {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = `Photo taken at ${item.lat}, ${item.lon}`;
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.appendChild(img);
    gallery.appendChild(div);
  });
}

// Event listeners
continueButton.addEventListener('click', capturePhotoAndLocation);

publicGalleryButton.addEventListener('click', () => {
  // Display only images without location data
  gallery.innerHTML = '';
  const photoGallery = JSON.parse(localStorage.getItem('photoGallery')) || [];
  photoGallery.forEach(item => {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = 'Public Photo';
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.appendChild(img);
    gallery.appendChild(div);
  });
});

// Initialize gallery on page load
window.onload = displayGallery;
