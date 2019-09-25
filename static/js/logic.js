
// Creating base layers for the map
const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"
});

const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"
});

const satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: "pk.eyJ1IjoiZXZhbnN0cm9oIiwiYSI6ImNrMDlwY3dydjBiN2gzY21nNmx2dmV4eXYifQ.e_Fy3PvcpXIhZTWFE7-3SQ"
});

// Assemble API query URL
const url = "http://127.0.0.1:5000/";

// Grab the data with d3
d3.json(url).then((data) => {
  console.log(data);

  data = data.results;

  // for marker clusters instead of regular markers
  // const veryHighViolationsLayer = L.markerClusterGroup();
  // const highViolationsLayer = L.markerClusterGroup();
  // const avgViolationsLayer = L.markerClusterGroup();
  // const lowViolationsLayer = L.markerClusterGroup();
  // const veryLowViolationsLayer = L.markerClusterGroup();
  // const noViolationsLayer = L.markerClusterGroup();

  const veryHighViolationsLayer = L.layerGroup();
  const highViolationsLayer = L.layerGroup();
  const avgViolationsLayer = L.layerGroup();
  const lowViolationsLayer = L.layerGroup();
  const veryLowViolationsLayer = L.layerGroup();
  const noViolationsLayer = L.layerGroup();

  // loop through the json
  data.forEach(function(response){
    const lat = response[2];
    const long = response[3];
    const name = response[0];
    const stars = response[9];
    const avg_violations = response[11];
    const times_inspected = response[12];

    function createMarker(lat,long,name,stars,avg_violations,color,layer) {
      if (lat){
        L.circle([lat, long],{
          fillOpacity: 1,
          color: color,
          fillColor: color,
          radius: 5
        }).addTo(layer).bindPopup(`<h2>Name: ${name}</h2><hr/><h2>Rating: ${stars}</br>Avg Violations: ${avg_violations}</br>Times Inspected: ${times_inspected}</h2>`);
      }
    }

    let color = '#73FA0A';

    if (avg_violations > 15){
      color = '#FC4602';
      createMarker(lat,long,name,stars,avg_violations,color,veryHighViolationsLayer);
    }
    else if (avg_violations > 10){
      color = '#e05702';
      createMarker(lat,long,name,stars,avg_violations,color,highViolationsLayer);
    }
    else if (avg_violations > 5){
      color = '#e07102';
      createMarker(lat,long,name,stars,avg_violations,color,avgViolationsLayer);
    }
    else if (avg_violations > 2.5){
      color = '#E6B51C';
      createMarker(lat,long,name,stars,avg_violations,color,lowViolationsLayer);
    }
    else if (avg_violations > 0){
      color = '#B5FA0A';
      createMarker(lat,long,name,stars,avg_violations,color,veryLowViolationsLayer);
    }
    else{
      createMarker(lat,long,name,stars,avg_violations,color,noViolationsLayer);
    }
    
  });
  
  // console.log(avgViolations);
  
  // create objects to hold the maps
  const baseMaps = {
    dark: darkmap,
    streets: streetmap,
    satellite: satellitemap
  };

  const overlayMaps = {
    Very_high: veryHighViolationsLayer,
    High: highViolationsLayer,
    Avg: avgViolationsLayer,
    Low: lowViolationsLayer,
    Minimal: veryLowViolationsLayer,
    None: noViolationsLayer
  };

  const myMap = L.map("map", {
    center: [41.8881, -87.6298],
    zoom: 13,
    // default when you load the page
    layers: [darkmap, lowViolationsLayer]
  });

  // create a legend/control panel
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}).catch((error) => {
  console.log(error)
});
