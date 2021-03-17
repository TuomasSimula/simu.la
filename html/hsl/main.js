// Initialise leaflet map
var lat = 60.185270, lng = 24.829556;
var map = L.map('mapid').setView([lat, lng], 13);
var markers = {};

// Get leaflet tiles from HSL API
var normalTiles = L.tileLayer('https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy;
			<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
        id: 'hsl-map'
}).addTo(map);

// Connect to MQTT endpoint for HSL API
var client = mqtt.connect("wss://mqtt.hsl.fi:443/");

// Topic to get position of all vehicles currently on a journey
var topic = "/hfp/v2/journey/ongoing/vp/+/+/+/+/+/+/+/+/3/#";

// Subscribe to topic
client.on("connect", function () {
    console.log("Connect");
    client.subscribe(topic);
});

// When change in vehicle position is received from MQTT
client.on('message', function (topic, message, packet) {
	// Get vehicle position object from message
    const vehiclePosition = JSON.parse(message).VP;

	// Get some values from message
    var vhclLat = vehiclePosition.lat;
	var vhclLng = vehiclePosition.long;
	var vhclNum = vehiclePosition.veh + "/" + vehiclePosition.oper;
	var vhclRoute = vehiclePosition.route;

	// Check that vehicle coordinates aren't empty
    if(!vhclLng || !vhclLat) return;

	// If this vehicle is already tracked, update position; otherwise add to markers array
    if(markers[vhclNum]) {
        markers[vhclNum].setLatLng([vhclLat, vhclLng]);
		markers[vhclNum].bindToolTip(vhclRoute);
    } else {
        markers[vhclNum] = L.marker([vhclLat, vhclLng]).addTo(map);
		markers[vhclNum].bindToolTip(vhclRoute);
    }
});
