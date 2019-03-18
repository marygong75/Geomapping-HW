//Default map location
var myMap = L.map("map", {
  center: [55, -80],
  zoom: 3
});

//Array to hold earthquake information
function createCircles(response) {
  var earthquakes = response.features

//Color of circles based on magnitude 
  function getColor(mag) {
    if (mag < 1) {color = "#ffff99"}
      else if (mag > 1 && mag < 2) {color = "#ffcc66"}
      else if (mag > 2 && mag < 3) {color = "#ff9933"}
      else if (mag > 3 && mag < 4) {color = "#ff6600"}
      else if (mag > 4 && mag < 100) {color = "#ff5050"}
      else {color = "#cc0066"}
    return color
  }

  //Radius of circles based on magnitude - array
  for (var i = 0; i < earthquakes.length; i++) {
      var earthquake = earthquakes[i]
      var coordinates = earthquake.geometry.coordinates
      var properties = earthquake.properties
      var mag = earthquake.properties.mag
      var color = getColor(mag)
      var radius = 5
      L.circle([coordinates[1], coordinates[0]], {
          fillOpacity: 0.60,

          color: color,
          radius: mag *30000
      //Pop-up box for more info
      }).bindPopup("</h1><h3>Place: "+properties.place
      +"</h3><hr><h3>Magnitude: "+properties.mag)
      .addTo(myMap)
  }

  //Adding legend for earthquake magnitude
  var legend = L.control({position: "bottomleft"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = ["#ffff99", "#ffcc66", "#ff9933", "#ff6600", "#ff5050", "#cc0066"]
    var magnitude = [0, 1, 2, 3, 4, 5];
    var legendInfo = "<h3> Magnitude</h3>"
    div.innerHTML = legendInfo
    for (var i=0; i<magnitude.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i>' +
        magnitude[i] + (magnitude[i+1] ? '&ndash;' + magnitude[i+1] + '<br>' : '+')
    }

    return div;
  };

  legend.addTo(myMap);
}

// Define variables for the base layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.light",
accessToken: API_KEY
}).addTo(myMap);

//USGS link - data
var url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url,createCircles)