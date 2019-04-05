

// function buildPieChart() {
  // Use `d3.json` to fetch the data for the pie and bubble chart
  var url = "/ageChart";
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
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 0,
      },
      // sizemode: 'area'
      height: 487.50,
      width: 450.
    };
    
    Plotly.newPlot('pie', data, layout);



})


