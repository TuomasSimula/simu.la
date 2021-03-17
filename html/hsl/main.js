var lat = 60.196671, lng = 24.654183;
var map = L.map('mapid').setView([lat, lng], 13);
var markers = {};

var normalTiles = L.tileLayer('https://cdn.digitransit.fi/map/v1/{id}/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
          '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 19,
        tileSize: 512,
        zoomOffset: -1,
        id: 'hsl-map'
}).addTo(map);

var client = mqtt.connect("wss://mqtt.hsl.fi:443/");

var topic = "/hfp/v2/journey/ongoing/vp/+/+/+/+/+/+/+/+/3/#";

client.on("connect", function () {
    console.log("Connect");
    client.subscribe(topic);
});

client.on('message', function (topic, message, packet) {
    const vehiclePosition = JSON.parse(message).VP;

    var vhclLat = vehiclePosition.lat, vhclLng = vehiclePosition.long, vhclNum = vehiclePosition.veh + "/" + vehiclePosition.oper;

    var topicArray = topic.split("/");

    if(!vhclLng || !vhclLat || parseInt(topicArray[12]) < 0) return;

    if(markers[vhclNum]) {
        markers[vhclNum].setLatLng([vhclLat, vhclLng]);;
    } else {
        markers[vhclNum] = L.marker([vhclLat, vhclLng]).addTo(map);
    }
});
