// Creating map object
const myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"

}).addTo(myMap);

// TODO:

// Store API query variables
const baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
// Add the dates in the ISO formats
const date = "$where=created_date between '' and ''";
// Add the complaint type
const complaint = "&complaint_type=Rodent";
// Add a limit
const limit = "&$limit=1000";


// Assemble API query URL
const url = baseURL + complaint + limit;

// Grab the data with d3
d3.json(url).then((data) => {
  console.log(data);

  const markers = L.markerClusterGroup();

  data.forEach(function(response){
    // const lat = response.latitude;
    // const long = response.longitude;

    const location = response.location;

    if (location) {
      
      const marker = markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]]));
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
