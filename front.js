fetch('/api/get-locations')
  .then(response => response.json())
  .then(data => {
    data.forEach(location => {
      console.log(`Latitude: ${location.latitude}, Longitude: ${location.longitude}, Timestamp: ${location.timestamp}`);
    });
  })
  .catch(error => {
    console.error('Error fetching locations:', error);
  });
