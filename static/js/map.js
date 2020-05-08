/**
 * Load the map and manage events relative to
 **/

const STARTING_MAP_CENTER = [51.505, -0.09];
const STARTING_ZOOM = 13;
const MAX_ZOOM = 18;

var tracking_map = L.map('map_container').setView(STARTING_MAP_CENTER, STARTING_ZOOM);

// Handle the markers plot on the map
var markers = {};
// Handle different markers design 
var icons = {};

// A demo and usage of various free tile providers can be found here:
// https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: MAX_ZOOM,
    id: 'background_map',
}).addTo(tracking_map);

// Will define design properties for a marker
// The color is compute based on the string passed
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

var source = new EventSource('/topic/geodata_stream_topic_123'); //ENTER YOUR TOPICNAME HERE

source.addEventListener('message', function(e){

  obj = JSON.parse(e.data);
  // console.log(obj);

    if(obj.service in markers) {
      if(obj.unit in markers[obj.service]) {

        tracking_map.removeLayer(markers[obj.service][obj.unit]);
      }
    } else {
      markers[obj.service] = [];
      // create a new icon for this service
      create_icon(obj.service);
    }

    markers[obj.service][obj.unit] = L.marker([obj.latitude, obj.longitude], {icon: icons[obj.service]}).addTo(tracking_map);
    markers[obj.service][obj.unit].bindTooltip(
      "Service: "  + obj.service + "<br>Unit: " + obj.unit + "<br>Datetime: " + obj.datetime
      ,{
        permanent: true
      }
    );

}, false);

