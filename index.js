const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: [0, 0],
    zoom: 4
  })
});

const geolocation = new ol.Geolocation({
  trackingOptions: {
    enableHighAccuracy: true
  }
});

geolocation.on('change', function() {
  const coordinates = geolocation.getPosition();
  map.getView().setCenter(coordinates);
  map.getView().setZoom(12);
});

document.getElementById('find').addEventListener('click', findLocation);
document.getElementById('findCurrent').addEventListener('click', function() {
  geolocation.setTracking(true);
  findLocation();
});

function findLocation() {
  geolocation.setTracking(true);
  const coordinates = geolocation.getPosition();
  const userIp = 'https://api.ipify.org?format=json';
  fetch(userIp)
    .then(response => response.json())
    .then(data => {
      const ip = data.ip;
      const url = `https://ipapi.co/${ip}/json/`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const resultDiv = document.getElementById('result');
          resultDiv.innerHTML = `
            <p>IP Address: ${ip}</p>
            <p>City: ${data.city}</p>
            <p>Country: ${data.country_name}</p>
            <p>Latitude: ${data.latitude}</p>
            <p>Longitude: ${data.longitude}</p>
          `;
          map.getView().setCenter([data.longitude, data.latitude]);
          map.getView().setZoom(12);
        })
        .catch(error => {
          console.error(error);
          resultDiv.innerHTML = 'Error: ' + error.message;
        });
    })
    .catch(error => {
      console.error(error);
      resultDiv.innerHTML = 'Error: ' + error.message;
    });
}