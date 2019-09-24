<<<<<<< HEAD

const myMap = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 11,
=======
// Creating map object
const myMap = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 11
>>>>>>> 6ff37d15bd3a8c9ec83e023d75748d741c49f52f
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"
<<<<<<< HEAD
=======

>>>>>>> 6ff37d15bd3a8c9ec83e023d75748d741c49f52f
}).addTo(myMap);

// Assemble API query URL
const url = "http://127.0.0.1:5000/";

// Grab the data with d3
d3.json(url).then((data) => {
<<<<<<< HEAD

  data = data.results;
  console.log(data);
=======
  console.log(data);

  data = data.results;
>>>>>>> 6ff37d15bd3a8c9ec83e023d75748d741c49f52f

  const markers = L.markerClusterGroup();

  data.forEach(function(response){
    const lat = response[2];
    const long = response[3];
<<<<<<< HEAD
    const name = response[0];
    const stars = response[9];

    if (lat){
      L.marker([lat, long]).addTo(markers).bindPopup(`<h1>${name}</h1><hr/><h3>${stars}</h3>`);
    }
  });
  
  myMap.addLayer(markers);
  
}).catch((error) => {
  console.log(error)
});
=======

    if (lat) {
      
      const marker = markers.addLayer(L.marker([lat, long]));
      marker.bindPopup(`<h1>${response.descriptor}</h1>`);
      markers.addLayer(marker);
    }
  });

  myMap.addLayer(markers);


}).catch((error) => {
  console.log(error)
});
  // Create a new marker cluster group

  // Loop through data

    // Set the data location property to a variable

    // Check for location property

      // Add a new marker to the cluster group and bind a pop-up

  // Add our marker cluster layer to the map
>>>>>>> 6ff37d15bd3a8c9ec83e023d75748d741c49f52f
