if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    },
    (error) => {
      console.error('Error obtaining location:', error);
    }
  );
} else {
  console.error('Geolocation is not supported by this browser.');
}
