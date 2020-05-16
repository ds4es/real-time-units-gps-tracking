/**
 * Load the map and manage events relative to
 **/
 
 // Instantiates a map object
var osm_layer = L.map('osm_layer').setView(MAP_STARTING_CENTER, MAP_STARTING_ZOOM);

 // Instantiates a map object
var object_layer = L.map('object_layer').setView(MAP_STARTING_CENTER, MAP_STARTING_ZOOM);

// To synchronize changes from object_layer to osm_layer
osm_layer.sync(object_layer);
        
// Hold marker plots on the map
var markers = {};
// Hold different marker colors 
var marker_colors = {};
// Marker tooltips initial display option
var display_tooltips = false;

// A demo and usage of various free tile providers can be found here:
// https://leaflet-extras.github.io/leaflet-providers/preview/
// Instantiates a tile layer object for the given URL
L.tileLayer(MAP_URL_TEMPLATE, {
    attribution: MAP_ATTRIBUTION,
    maxZoom: MAP_MAX_ZOOM,
    id: 'background_map',
}).addTo(osm_layer);

// Opens a connection to the server to begin receiving events 
// (or data or messages) from it
var source = new EventSource('/topic/' + KAFKA_TOPIC); //ENTER YOUR TOPICNAME HERE

// Message handler for new message events
source.addEventListener('message', function(e){

    // Parse received data as a JSON object
    obj = JSON.parse(e.data);
    // console.log(obj);

    // Before plotting a unit check if this one was not already plot 
    if(obj.service in markers) {
        if(obj.unit in markers[obj.service]) {

        // Remove the previous position of the unit before adding 
        // a new marker for it on the map
        object_layer.removeLayer(markers[obj.service][obj.unit]);
        }
    } else {
        // The first time a service is handle, we create an array to 
        // track its units
        markers[obj.service] = [];
        // ..and we define and hold a color for this service
		marker_colors[obj.service] = string_to_color(obj.service) ;
    }

	// Define the color of the marker
	// If a color argument is passed with the message the marker it will be used
	// otherwise marker_colors will be used 
	if (obj.color) {
		marker_color = obj.color;
	} else
		marker_color = marker_colors[obj.service];

    // Plot the new position of the new received unit position 
    markers[obj.service][obj.unit] = L.marker([obj.latitude, obj.longitude], {icon: L.divIcon({
        className: "custom_pin",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: '<span class="unit_marker" style="background-color: '+marker_color+'"/>'
    })}).addTo(object_layer);
    // Add a tooltip to it with the given information
    markers[obj.service][obj.unit].bindTooltip(
        "Service: "  + obj.service + "<br>Unit: " + obj.unit + "<br>Datetime: " + obj.datetime
        ,{
            // For a permanent display of the unit tooltip
            permanent: display_tooltips
        }
    );

}, false);

function toggle_button() {
    if(document.getElementById("toggle_button").value=="ON") {
        document.getElementById("toggle_button").value="OFF";
        display_tooltips = false;
    } else {
        document.getElementById("toggle_button").value="ON";
        display_tooltips = true;
    }
}