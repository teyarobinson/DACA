var dacaURL = "/map";
        
  // Perform a GET request to the query URL
  d3.json(dacaURL, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });
  
  function createFeatures(dacaData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the city/location name.
    function onEachFeature(feature, layer) {
      layer.bindPopup("<p>" + feature.properties.NAME + "</p>");
    }
  
    // Create a GeoJSON layer containing the features array on the dacaData object
    // Run the onEachFeature function once for each piece of data in the array
    var daca = L.geoJSON(dacaData, {
      onEachFeature: onEachFeature
    });
  
    // Sending our earthquakes layer to the createMap function
    createMap(daca);
  }
  
  function createMap(daca) {
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      DACA_recipient_locations: daca
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("display", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, daca]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }

 
var submit = d3.select("#filter-btn");
var dropDownSelection = d3.select("#dropDown");  
var selection = dropDownSelection.property("value");
submit.on("click", function() {
  d3.event.preventDefault();

  document.getElementById("display").innerHTML = "";

  if(selection ==="mapChart") {
    window.location.reload();;
  }


  var url = "/ageChart";

  if(selection ==="ageChart") {    
    
  d3.json(url).then(function(data) {
    
    // variables to hold Age pie chart data
    var ages = data.Age;
    var numbers = data.Number;
    var percent = data.Percent;
    
    // plotting the pie chart
    var data = [{
      labels: Object.values(ages),
      values: Object.values(numbers),
      hovertext: Object.values(percent),
      title: "Ages of DACA Recipients<br>",
      type: 'pie'
    }];
    
    var layout = {
      autosize: true,
      margin: {
        l: 460,
        r: 0,
        b: 0,
        t: 0,
        pad: 0,
      },
      // sizemode: 'area'
      height: 600,
      width: 1200.
    };
    
    Plotly.newPlot('display', data, layout);

})}


// Use `d3.json` to fetch the data for the pie and bubble chart
var url = "/genderChart";
if(selection ==="genderChart") { 


  d3.json(url).then(function(data) {
    
    // variables to hold Age pie chart data
    var sexes = data.Sex;
    var numbers = data.Number;
    var percent = data.Percent;
    
    // plotting the pie chart
    var pieData = [{
      labels: Object.values(sexes),
      values: Object.values(numbers),
      hovertext: Object.values(percent),
      title: "Gender Percentages of DACA Recipients",
      type: 'pie'
    }];
    
    var layout = {
      autosize: true,
      margin: {
        l: 460,
        r: 0,
        b: 0,
        t: 0,
        pad: 0,
      },
      // sizemode: 'area'
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('display', pieData, layout);

})
}


var url = "/originChart";
if(selection==="originChart") {
d3.json(url).then(function(data) {
  
  // variables to hold Age pie chart data
  var Uncountries = data.Country;
  var UNnumbers = data.Number;
  var Recountries = Object.values(Uncountries);
  var Renumbers = Object.values(UNnumbers);
  var countries = Recountries.slice(0,10);
  var numbers = Renumbers.slice(0,10);

  var chart = new CanvasJS.Chart("display", {
    animationEnabled: true,
    height:650,
    
    
    title:{
      text:"Top 10 Countries of Origin for DACA Recipients"
    },
    axisX:{
      interval: 1
    },
    axisY2:{
      interlacedColor: "lightgrey",
      gridColor: "rgba(1,77,101,.1)",
      title: "Number of DACA Recipients"
    },
    data: [{
      type: "bar",
      name: "countries",
      axisYType: "secondary",
      color: "blue",
      dataPoints: [
              { y: numbers[9], label: countries[9]},
              { y: numbers[8], label: countries[8]},
              { y: numbers[7], label: countries[7]},
              { y: numbers[6], label: countries[6]},
              { y: numbers[5], label: countries[5]},
              { y: numbers[4], label: countries[4]},
              { y: numbers[3], label: countries[3]},
              { y: numbers[2], label: countries[2]},
              { y: numbers[1], label: countries[1]},			         
              { y: numbers[0], label: countries[0]},
      ]
    }]
  });


  chart.render();  
});
}
})


