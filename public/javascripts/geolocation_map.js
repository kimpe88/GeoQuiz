var USERNAME_ENEMY_TEMP = "user2";
var USERNAME_TEMP = "user1";
var USERNAME_ALLY_TEMP = "viking";
var map;
var radius;
var l = window.location;
var base_url = l.protocol + "//" + l.host + "/";
var scale = 0.001;
var drawOffset = 0.0005;
var marker;
var pos;
var COLOR_ALLY = "#00FFFF";
var COLOR_RIVAL = "#FF0000";
var COLOR_SELF = "#00FF00";

var geolocationMap = function () {
    function initialize() {
        var mapOptions = {
            zoom: 17
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var icon = "../images/viking icon.png";
                marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: icon
                });
                radius = new google.maps.Circle({
                    strokeColor: '#FFFF00',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FFFF00',
                    fillOpacity: 0.35,
                    center: pos,
                    map: map,
                    radius: 180
                });
                radius.bindTo("center", marker, "position");
                map.setCenter(pos);

                fetchKnownAreas();

                //Store the geo data on the server
                jQuery.ajax({
                    url: base_url + 'play/set_geo',
                    dataType: 'json',
                    type: 'POST',
                    timeout: 5000,
                    data: {
                        lat: pos.lat(),
                        lng: pos.lng()
                    },
                    success: function (response) {
                        if (response.status === 'OK') {
                            console.log(pos.toString() + " = [" + response.geo[0] + ", " + response.geo[1] + "]?");
                        }
                    }, error: function (jqXHR, textStatus, errorThrown) {
                        console.log(JSON.stringify(jqXHR));
                        console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
                    }
                });
            }
            , function () {
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }

    }

    function handleNoGeolocation(errorFlag) {
        var content;
        if (errorFlag) {
            content = 'Error: The Geolocation service failed.';
        } else {
            content = 'Error: Your browser doesn\'t support geolocation.';
        }

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }


    google.maps.event.addDomListener(window, 'load', initialize);
};

var fetchKnownAreas = function () {
    jQuery.ajax({
        url: base_url + 'play/get_known_locations',
        dataType: 'json',
        type: 'POST',
        timeout: 5000,
        success: function (response) {
            if (response.status === 'OK') {
                var tiles = response.tiles;
                // loop through places and add markers
                for (var t in tiles) {
                    //create gmap latlng obj
                    var LatLngBounds = new google.maps.LatLngBounds(
                            new google.maps.LatLng(tiles[t].geo[0] - drawOffset, tiles[t].geo[1] - drawOffset),
                            new google.maps.LatLng(tiles[t].geo[0] + drawOffset, tiles[t].geo[1] + drawOffset)
                            );

                    var color = null;
                    if (tiles[t].owner === USERNAME_ALLY_TEMP) {
                        color = COLOR_ALLY;
                    } else if (tiles[t].owner === USERNAME_ENEMY_TEMP) {
                        color = COLOR_RIVAL;
                    } else if (tiles[t].owner === USERNAME_TEMP) {
                        color = COLOR_SELF;
                    }
                    if (color !== null) {
                        var rectangle = new google.maps.Rectangle({
                            strokeColor: color,
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: color,
                            fillOpacity: 0.35,
                            map: map,
                            bounds: LatLngBounds
                        });
                        google.maps.event.addListener(rectangle, 'click', move);
                    }
                }
            }
        }, error: function (xmlhttprequest, status, message) {
            // do error checking
            alert("something went wrong");
            console.error(status);
        }
    });
}

var getSurroundingAreas = function () {
    var areas = [];
    var bounds = radius.getBounds();
    for (var x = -3 * scale; x <= 3 * scale; x += scale) {
        for (var y = -3 * scale; y <= 3 * scale; y += scale) {
            var latLng = new google.maps.LatLng(pos.lat() + x, pos.lng() + y);
            if (bounds.contains(latLng)) {
                areas.push(latLng.toString());
            }
        }
    }
    return areas;
}

var move = function () {

}

//Run
geolocationMap();
