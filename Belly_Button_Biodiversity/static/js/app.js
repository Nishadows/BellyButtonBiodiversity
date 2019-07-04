function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((sampledata) => {
      var sampleMetadata = sampledata;
      console.log(sampleMetadata);
  
    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    var selector = d3.select("#sample-metadata");
    selector.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleMetadata).forEach( function([key, value]) {
        console.log(key, value);
        selector.append("p").text(`${key}: ${value}`);
      }
    );

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

  });
};


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sampledata) => {
    var sampleMetadata = sampledata;
    console.log(sampleMetadata);

    // @TODO: Build a Bubble Chart using the sample data
    
    var trace1 = {
      type: "scatter",
      x: sampleMetadata.otu_ids,
      y: sampleMetadata.sample_values,
      mode: 'markers',
      marker: {
        size: sampleMetadata.sample_values,
        color: sampleMetadata.otu_ids,
        colorscale: "Earth"
      },
      text: sampleMetadata.otu_labels
    };

    var data = [trace1];

    var layout = {
      showlegend: false,
      width: 1200,
      height: 550,
      xaxis: {
        title: "OTU ID"
      }
    };

    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var slicedData = {};
    console.log(sampleMetadata.sample_values.slice(0,10));
    slicedData["sample_vals"] = sampleMetadata.sample_values.slice(0,10);
    slicedData["otus"] = sampleMetadata.otu_ids.slice(0,10);
    slicedData["otu_lbls"] = sampleMetadata.otu_labels.slice(0,10);
    
    console.log(slicedData);

    var trace2 = {
      type: "pie",
      values: slicedData.sample_vals,
      labels: slicedData.otus,
      hovertext: slicedData.otu_lbls
    };

    var piedata = [trace2];

    Plotly.newPlot('pie', piedata)
    
  });
};


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
    const firstSample = parseInt(sampleNames[0]);
    console.log(firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
};


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
