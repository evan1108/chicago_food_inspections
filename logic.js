
const myMap = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 11,
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"
}).addTo(myMap);

// Assemble API query URL
const url = "http://127.0.0.1:5000/";

// Grab the data with d3
d3.json(url).then((data) => {

  data = data.results;
  console.log(data);

  const markers = L.markerClusterGroup();

  data.forEach(function(response){
    const lat = response[2];
    const long = response[3];
    const name = response[0];
    const stars = response[9];

    if (lat){
      const marker = markers.addLayer(L.marker([lat, long]));
      marker.bindPopup(`<h1>${name}</h1><hr/><h3>${stars}</h3>`);
      markers.addLayer(marker);
    }
  });
  
  myMap.addLayer(markers);
  
}).catch((error) => {
  console.log(error)
});