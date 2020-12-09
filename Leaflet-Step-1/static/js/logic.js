// Color scale array
var colorScale = [
    "#ABEBC6",
    "#F7DC6F",
    "#F1C40F",
    "#F39C12",
    "#D35400",
    "#C0392B"
];
// funtion to return color based on depth val
function getColor(val) {
    switch (true) {
        case val > 90:
            return colorScale[5];
        case val > 70:
            return colorScale[4];
        case val > 50:
            return colorScale[3];
        case val > 30:
            return colorScale[2];
        case val > 10:
            return colorScale[1];
        default:
            return colorScale[0];

    }
}

// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    maxZoom: 15,
    id: "dark-v10",
    accessToken: API_KEY
}).addTo(myMap);


// API url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Read in JSON data from URL
d3.json(queryUrl, function (data) {
    // Create markers
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: function (feature) {
            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: getColor(feature.geometry.coordinates[2]),
                // fillColor: "#000000",
                color: "#000000",
                radius: feature.properties.mag*4,
                // radius: 15,
                stroke: true,
                weight: 0.5
            };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr>Magnitude: " + feature.properties.mag +
                "<br>Depth: " + feature.geometry.coordinates[2]);
        }
    }).addTo(myMap);

    // Create a legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {

        var div = L.DomUtil.create('div', 'info legend');
        var grades = [0, 10, 30, 50, 70, 90];
        // labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorScale[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

});