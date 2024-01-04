// API for Data Source
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// // Fetch the JSON data and console log it
// d3.json(url).then(function(data) {
//   console.log(data);
// });

// FUNCTION: Populate Demographic Info
function populateDemoInfo(patientID) {

    d3.selectAll("#sample-metadata").text("","");
    var demographicInfoBox = d3.select("#sample-metadata");
    
    
    d3.json(url).then(data => {
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        console.log("Selected Patient Details: ", filteredMetadata);
        Object.entries(filteredMetadata).forEach(([key, value]) => {
            demographicInfoBox.append("p").text(`${key}: ${value}`)
         })


    })
}

// FUNCTION: Build All Charts 
function buildCharts(patientID) {

    // READ & INTERPRET THE DATA
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    // Read in the JSON data
    d3.json(url).then((data => {

        // Define samples
        var samples = data.samples
        var metadata = data.metadata
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        // Filter by patient ID
        var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

        // Create variables for chart
        // Grab sample_values for the bar chart
        var sample_values = filteredSample.sample_values

        // Use otu_ids as the labels for bar chart
        var otu_ids = filteredSample.otu_ids

        // use otu_labels as the hovertext for bar chart
        var otu_labels = filteredSample.otu_labels

        // console.log("Selected Patient Details: ", filteredSample);

        // BAR CHART
        // Create the trace
        var bar_data = [{
            // Use otu_ids for the x values
            x: sample_values.slice(0, 10).reverse(),
            // Use sample_values for the y values
            y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
            // Use otu_labels for the text values
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
            
        }]


        // // Define plot layout
        var bar_layout = {
            title: "Top 10 Microbial Species <br /> in Belly Buttons",
        };

        // Display plot
        Plotly.newPlot('bar', bar_data, bar_layout)
       
        // BUBBLE CHART
        // Create the trace
        var bubble_data = [{
            // Use otu_ids for the x values
            x: otu_ids,
            // Use sample_values for the y values
            y: sample_values,
            // Use otu_labels for the text values
            text: otu_labels,
            mode: 'markers',
            marker: {
                // Use otu_ids for the marker colors
                color: otu_ids,
                // Use sample_values for the marker size
                size: sample_values,
                colorscale: 'YlGnBu'
            }
        }];


        // Define plot layout
        var layout = {
            title: "Belly Button Samples",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        // Display plot
        Plotly.newPlot('bubble', bubble_data, layout)

        // GAUGE CHART
        // Create variable for washing frequency
        var washFreq = filteredMetadata.wfreq

        // Create the trace
        var gauge_data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFreq,
                title: { text: " Belly Button Washing Frequency <br /> (Scrubs per Week)" },
                type: "indicator",
                // shape: "angular",
                mode: "gauge+number",
                gauge: {
                    bar: {color: 'red'},
                    axis: { range: [null, 9], 
                            visible: true,
                            tickmode: "array",
                            tickvals: [0, 1, 2, 3, 4,5,6,7, 8,9, 10],
                            ticks: "inside" },
                    
                    steps: [
                        { range: [0, 1], color: 'rgb(255, 245, 220)'  },
                        { range: [1, 2], color: 'rgb(245, 253, 180)'  },
                        { range: [2, 3], color: 'rgb(238, 220, 130)'  },
                        { range: [3, 4], color: 'rgb(201, 204, 63)'  },
                        { range: [4, 5], color: 'rgb(180, 196, 36)' },
                        { range: [5, 6], color: 'rgb(147, 197, 114)' },
                        { range: [6, 7], color: 'rgb(60,179,113)' },
                        { range: [7, 8], color: 'rgb(50,205,50)' },
                        { range: [8, 9], color: 'rgb(0,128,0)'  },
                    ],

                }
            }
        ];

        // // Define Plot layout
        var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

        // // Display plot
        Plotly.newPlot('gauge', gauge_data, gauge_layout);

       
    }))


};

// FUNCTION: Event Handling for Change of Data selection
function optionChanged(patientID) {
    console.log("Selected patientID: ",patientID);
    populateDemoInfo(patientID);
    buildCharts(patientID);
}

// FUNCTION: Initiate First Records and Show All Charts and Demographic Info
function initDashboard() {
    var dropdown = d3.select("#selDataset")
    d3.json(url).then(data => {
        var patientIDs = data.names;
        patientIDs.forEach(patientID => {
            dropdown.append("option").text(patientID).property("value", patientID)
        })
        
        console.log("Default patientID: ", patientIDs[0]);
        populateDemoInfo(patientIDs[0]);
        buildCharts(patientIDs[0]);
        
    });
};

// Invoke JS- Start
initDashboard();
