function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("panel-body");
      row.text(`${key}: ${value} \n`);
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    //lol how about no?
}

function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
// @TODO: Build a Bubble Chart using the sample data
    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var m_size = data.sample_values;
    var m_colors = data.otu_ids; 
    var t_values = data.otu_labels;

    var trace1 = {
      x: x_values,
      y: y_values,
      text: t_values,
      mode: 'markers',
      marker: {
        color: m_colors,
        size: m_size
      } 
    };

var data = [trace1];
var layout = {
  xaxis: { title: "OTU ID"},
};
Plotly.newPlot('bubble', data, layout);
    // @TODO: Build a Pie Chart
    d3.json(url).then(function(data) {  
      var pie_values = data.sample_values.slice(0,10);
        var pie_labels = data.otu_ids.slice(0,10);
        var pie_hover = data.otu_labels.slice(0,10);
        var data = [{
          values: pie_values,
          labels: pie_labels,
          hovertext: pie_hover,
          type: 'pie'
        }];
  
        Plotly.newPlot('pie', data);
  
      });
    });
}
//I can't figure out what I did, but somehow now for certain subjects, there are no labels.
//Just the number. It's not across the board (482 is just Bacteria, but 839 has a bacteria name and type. I don't know what I did or why it's
// like this, but I think it must be something with the data, not the app, so I will continue. )
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildMap(firstSample)
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildMap(newSample);
}
//to do the map, I'm pulling in the last homework. This is just an outline.
// Perform a GET request to the query URL
d3.json(earthquakeURL, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the magnitude, place and time of the earthquake
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: .6,
        color: "#000",
        stroke: true,
        weight: .8
    })
  }
  });

  
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


function createMap(earthquakes) {

    // Define different map layers
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token="+API_KEY);

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
      "access_token="+API_KEY);
    
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token="+API_KEY);
  
  
    // Define a baseMaps object to hold our base layers
    // Pass in our baseMaps 
    var baseMaps = {
      "Satellite": satellite,
      "Dark Map": darkmap,
      "Outdoors": outdoors
    };

    // Creat a layer for the tectonic plates
    var tectonicPlates = new L.LayerGroup();

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Earthquakes": earthquakes,
      "Tectonic Plates": tectonicPlates
    };

    // Create our map, giving it the satellite, earthquakes and tectonic plates layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -75.71],
      zoom: 3.25,
      layers: [satellite, earthquakes, tectonicPlates]
    }); 

    // Add Fault lines data
    d3.json(tectonicPlatesURL, function(plateData) {
      // Adding our geoJSON data, along with style information, to the tectonicplates
      // layer.
      L.geoJson(plateData, {
        color: "cyan",
        weight: 0.5
      })
      .addTo(tectonicPlates);
  });

  
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

  //Create a legend on the bottom left
  var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function(myMap){
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}
   

  //Create color range for the circle diameter 
  function getColor(d){
    return d > 5 ? "#a54500":
    d  > 4 ? "#cc5500":
    d > 3 ? "#ff6f08":
    d > 2 ? "#ff9143":
    d > 1 ? "#ffb37e":
             "#ffcca5";
  }

  //Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle. 
  function getRadius(value){
    return value*25000
  }
// Initialize the dashboard
init();

//maybe?
@app.route('/mapbox_gl')
def mapbox_gl():
    route_data = get_route_data()

    return render_template('mapbox_gl.html', 
        ACCESS_KEY=MAPBOX_ACCESS_KEY,
        route_data = route_data
    )

  map.on('load', function () {
  // Add this to end of function
    var stop_locations = {{ stop_locations|safe }}
    stop_locations.forEach(function(marker) {
    var el = document.createElement('div');
    el.className = 'marker';
    el.style.left = '-15px';
    el.style.top = '-32px';
  
    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
    }))};