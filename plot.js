
function init() {

    //Create arrays with all the data to be used
    d3.json("samples.json").then((data) => {
        //var metadata= data.metadata;
        var names=data.names;
        //var samples=data.samples;

        var dropdown = d3.select("#selectOption");

        //With the each function, it is collected the id data and appended to the dropdown
       names.forEach((name) => {
            dropdown
                //.append("select")
                .append("option")
                .text(name)
                .attr("value", name);
        });
  
    });
}

//Another way of doing it.
/*var test=[];

function init() {

    //Create arrays with all the data to be used
    d3.json("samples.json").then((data) => {
        //var metadata= data.metadata;
        var names=data.names;
        //var samples=data.samples;

        for (i=0;i<names.length;i++){
            var namesd=names[i];
           
            test.push(namesd)
         
        }
        //console.log("Info del arreglo test.")
        //console.log(test)

        var dropdown = d3.select("#selectOption");

        //With the each function, it is collected the id data and appended to the dropdown
       test.forEach((t_name) => {
            dropdown
                //.append("select")
                .append("option")
                .text(t_name)
                .attr("value", t_name);
        });
  
    });
}*/


function idSelected(selection) {
    //Create plots and patient information every time an id is chosen
    createPlots(selection);
    patientInformation(selection);
}

function patientInformation(selection) {
    console.log(selection)
    d3.json("samples.json").then((data) => {
        var metadata= data.metadata;
        //var names=data.names;
        //var samples=data.samples;

        var filteredData = metadata.filter(mdata => mdata.id == selection);

        //The filtered data is stored in position[0], thus it is necesarry to collect the data in another variable

        var filtered_final=filteredData[0];
    
        console.log(filtered_final)

        var card = d3.select("#patientData");

        //Clean card if there is data on it
        card.html("")

        //The function Object.entries will select the key and the value to be printed in the card
        Object.entries(filtered_final).forEach(([key, value]) => {
            $("#patientData").append(`${key}: ${value}<br>`);
        });
        
 
    });
  
}

function createPlots(selection){
    d3.json("samples.json").then((data) => {
        var sample= data.samples;

        //Filter the sample data acoording to the idSelected in the HTML file
        var filteredSample = sample.filter(sdata => sdata.id == selection);

        //The filtered data is stored in position[0], thus it is necessary to collect the data in another variable
        var filtered_final=filteredSample[0];

        var otuids=filtered_final.otu_ids;
        var samplevalues=filtered_final.sample_values;
        var otulabels=filtered_final.otu_labels;

        //console.log(otuids)


        //Bar plot

        //The function reverse is used to order the otu_ids from the greatest.
        var order_otuids = otuids.map(otuid => `OTU ${otuid}`).reverse();
        var y_label=order_otuids.slice(0,10);

        //console.log(order_otuids)
        //console.log(y_label)

        var trace1 = [
          {
            y: y_label,
            x: samplevalues.slice(0, 10).reverse(),
            text: otulabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",
          }
        ];
    
   
        Plotly.newPlot("bar", trace1);

    //Bubble Chart
    var trace2 = [
        {
          y: samplevalues,
          x: otuids,          
          text: otulabels,
          mode: "markers",
          marker: {
            size: samplevalues,
            color: otuids,
            //showscale=True
          }
        }
        
      ];

      var bubblelayout = {
        height: 1000,
        width: 1000,
        showlegend: false,
        xaxis: { title: "OTU id" },
        title: "Bacteria Cultures"
      };
      
  
      Plotly.newPlot("bubble", trace2, bubblelayout);
       

    });


}
init();

