/**
 * Builds the GoogleMap object and locates the users position.
 */
var map;

var geolocationMap = function () {
    function initialize() {
        var mapOptions = {
            zoom: 17
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                //alert(pos);

                var icon = "images/viking icon.png";

                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: icon
                });

                var radius = new google.maps.Circle({
                    strokeColor: '#FFFF00',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FFFF00',
                    fillOpacity: 0.35,
                    center: pos,
                    map: map,
                    radius: 180
                });

                //Make AJAX calls and use these to draw rectangles on the area

                //TEMP STUFF OMG!!!
                 var rectangle = new google.maps.Rectangle({
                    strokeColor: '#00FF00',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#009900',
                    fillOpacity: 0.35,
                    map: map,
                    bounds: new google.maps.LatLngBounds(
                            new google.maps.LatLng(position.coords.latitude + (1 * 0.001), position.coords.longitude + (1 * 0.001)),
                            new google.maps.LatLng(position.coords.latitude + (2 * 0.001), position.coords.longitude + (2 * 0.001)))
                });
                rectangle = new google.maps.Rectangle({
                    strokeColor: '#00FF00',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#009900',
                    fillOpacity: 0.35,
                    map: map,
                    bounds: new google.maps.LatLngBounds(
                            new google.maps.LatLng(position.coords.latitude + (2 * 0.001), position.coords.longitude + (1 * 0.001)),
                            new google.maps.LatLng(position.coords.latitude + (3 * 0.001), position.coords.longitude + (2 * 0.001)))
                });
                rectangle = new google.maps.Rectangle({
                    strokeColor: '#00FF00',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#009900',
                    fillOpacity: 0.35,
                    map: map,
                    bounds: new google.maps.LatLngBounds(
                            new google.maps.LatLng(position.coords.latitude + (1 * 0.001), position.coords.longitude + (2 * 0.001)),
                            new google.maps.LatLng(position.coords.latitude + (2 * 0.001), position.coords.longitude + (3 * 0.001)))
                });

                map.setCenter(pos);
            }, function () {
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

        var options = {
            map: map,
            position: new google.maps.LatLng(60, 105),
            content: content
        };

        var infowindow = new google.maps.InfoWindow(options);
        map.setCenter(options.position);
    }

    google.maps.event.addDomListener(window, 'load', initialize);
};

/**
 * MEMO:
 * Latitude (x) -90 --> 90
 * Longitude (y) -180 --> 180
 * Scale = 0.001
 * Results in:
 * 180'000 x 320'000 = 57'600'000'000 tiles! (oh shit!)
 */


//Run
geolocationMap();
