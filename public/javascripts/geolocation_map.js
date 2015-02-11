/**
 * Builds the GoogleMap object and locates the users position.
 */
var geolocationMap = function () {
    var map;

    function initialize() {
        var mapOptions = {
            zoom: 12
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                // alert(pos);

                var icon = "images/viking icon.png";

                var marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: icon
                });

                map.setCenter(pos);

                for (var x = 0; x < 10; x++) {
                    for (var y = 0; y < 5; y++) {
                        pos = new google.maps.LatLng(position.coords.latitude + (x * 0.001), position.coords.longitude + (y * 0.001));
                        var rectangle = new google.maps.Rectangle({
                            strokeColor: '#00FF00',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#009900',
                            fillOpacity: 0.35,
                            map: map,
                            bounds: new google.maps.LatLngBounds(
                                    new google.maps.LatLng(position.coords.latitude + (x * 0.001), position.coords.longitude + (y * 0.001)),
                                    new google.maps.LatLng(position.coords.latitude + ((x + 1) * 0.001), position.coords.longitude + ((y + 1) * 0.001)))
                        });
                    }
                }
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
 * 180'000 x 320'000 = 57'600'000'000 tiles!
 */


//Run
geolocationMap();
