/**
 * Load the map and manage events relative to
 **/

const STARTING_MAP_CENTER = [51.505, -0.09];
const STARTING_ZOOM = 13;
const MAX_ZOOM = 18;

// Instantiates a map object
var tracking_map = L.map('map_container').setView(STARTING_MAP_CENTER, STARTING_ZOOM);

// Hold markers plot on the map
var markers = {};
// Hold different marker designs 
var icons = {};

var display_tooltips = true;

// A demo and usage of various free tile providers can be found here:
// https://leaflet-extras.github.io/leaflet-providers/preview/
// Instantiates a tile layer object for the given URL
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: MAX_ZOOM,
    id: 'background_map',
}).addTo(tracking_map);

// Design property definition for a marker
// The color is compute based on the 'string' parameter
function create_icon(string) {
    const marker_html_styles = 'background-color: ' + string_to_color(string) +';'

    icons[string] = L.divIcon({
        className: "custom_pin",
        iconAnchor: [0, 24],
        labelAnchor: [-6, 0],
        popupAnchor: [0, -36],
        html: '<span class="unit_marker" style="'+ marker_html_styles + '"/>'
    })
}

// Opens a connection to the server to begin receiving events 
// (or data or messages) from it
var source = new EventSource('/topic/geodata_stream_topic_123'); //ENTER YOUR TOPICNAME HERE

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
        tracking_map.removeLayer(markers[obj.service][obj.unit]);
        }
    } else {
        // The first time a service is handle, we create an array to 
        // track its units
        markers[obj.service] = [];
        // ..and we create a specific unit icon for it
        create_icon(obj.service);
    }

    // Plot the new position of the new received unit position 
    markers[obj.service][obj.unit] = L.marker([obj.latitude, obj.longitude], {icon: icons[obj.service]}).addTo(tracking_map);
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
    if(document.getElementById("toggle_button").value=="OFF") {
        document.getElementById("toggle_button").value="ON";
        display_tooltips = true;
    } else {
        document.getElementById("toggle_button").value="OFF";
        display_tooltips = false;
    }
}