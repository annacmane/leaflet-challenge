// // Your first task is to visualize an earthquake dataset. Complete the following steps:

// // Get your dataset. To do so, follow these steps:

// // The USGS provides earthquake data in a number of different formats, updated every 5 minutes. 
// // Visit the USGS GeoJSON FeedLinks to an external site. page and choose a dataset to visualize.
// When you click a dataset (such as "All Earthquakes from the Past 7 Days"), you will be given a JSON representation of that data. Use the URL of this JSON to pull in the data for the visualization. The following image is a sampling of earthquake data in JSON format:
// 4-JSON

// ******** All earthquakes in the last hour:
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson

// Import and visualize the data by doing the following:

// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.

// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.

// Hint: The depth of the earth can be found as the third coordinate for each earthquake.

// Include popups that provide additional information about the earthquake when its associated marker is clicked.

// Create a legend that will provide context for your map data.

// // 

// Create map
let myMap = L.map("map").setView([45.52, -122.67], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"

d3.json(url).then(function(data) {
    let earthquakes = data.features;

    earthquakes.forEach(function(earthquake) {
        let coordinates = [earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]];
        let magnitude = earthquake.properties.mag;
        let depth = earthquake.geometry.coordinates[2];
        let timestamp = earthquake.properties.time;
        let date = new Date(timestamp)

        let markerSize = magnitude * 10;
        let markerColor = getColor(depth);

        L.circleMarker(coordinates, {
            fillOpacity: 0.5,
            color: "#000",
            weight: 1,
            fillColor: markerColor,
            radius: markerSize
        }).bindPopup(`<center><h3>${earthquake.properties.place}</h3></center><hr><p><b>Magnitude:</b> ${magnitude}&nbsp;<b>Depth:</b>${depth}</p><p><b>Date:</b>${date}</p></hr>`)
        // }).bindPopUp(`<center><h3>${earthquake.properties.place}</h3></center><hr><p><b>Magnitude:</b> ${magnitude}&nbsp;<b>Depth:</b>${depth}</p><p><b>Date:</b>${date}</p></hr>`)
        .addTo(myMap);
    });
    let legend = L.control({position: "topright"});

    legend.onAdd = function() {
        let div = L.DomUtil.create("div","info legend");
        let limits = [10, 30, 50, 70, 90];
        let colors = ["#2ca25f","#ffeda0","#fe9929","#fc4e2a","#bd0026", "#67000d"];

        for (var i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style="background-color:' + colors[i] + '"></i>'+ limits[i] + (limits[i+1] ? '&ndash;' +limits[i+1] + '<br>' : '+' );
        }
        return div;
    };
    
    legend.addTo(myMap);

    function getColor(depth) {
        if (depth < 10) return "#2ca25f";
        if (depth < 30) return "#ffeda0";
        if (depth < 50) return "#fe9929";
        if (depth < 70) return "#fc4e2a";
        if (depth < 90) return "#bd0026";
        else return "#67000d";
    }
});