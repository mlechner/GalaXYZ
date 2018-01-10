/**
 * Handles the routing request and rendering protocol
 * *
 * @author: enocholumide
 */
//------------------------------------------------------------------------------

var directionPoints = [];
var reroute = false;
var routingCapability = false;

var node_id;


function initRouting() {

    directions = new L.FeatureGroup();
    routingCapability = true;

    map.addLayer(directions);
}

/**
 * Add a direction point
 *
 * @param {number} x - lon
 * @param {number} y  -lat
 *
 */
function addDirectionPoint(x, y) {

    if (routingCapability) {

        console.log("Processing route!");

        var point = turf.point([x, y]);

        // Find the closest node_id in the network and proces the new point

        getClosestNode(x, y, node_id => processNewPoint(node_id, point));


    } // if routing capabilty is enabled

    else
        console.log("%Something went wrong, routing capability for this program might not have been enabled, ensure the initRouting function is properly configured", "background: red; color: white; font-size: large");

} // Add direction point

/**
 * Process a new point on the map with its closest node ID
 * Serves as a callback funtion from the ajax _ php request
 * Nothing happens if the node_id is null or undefined
 *
 * @param {number} node_id  -  Closest node id of the point
 * @param {Geojson} point - Point clicked on the map
 */
function processNewPoint(node_id, point) {

    // Check if the node ID is valid
    if (node_id === undefined || node_id === null) {

        console.log("%cClosest node cannot be found on the network, cannot proccess point!", "background: red; color: white; font-size: large");

    }

    else {

        // Attach the closest node ID to the point
        point.node_id = node_id;

        // Create Leaflet latlng
        point.latlng = [point.geometry.coordinates[1], point.geometry.coordinates[0]];

        // Add point to list
        directionPoints.push(point);
        renderDirectionPoint(node_id, point);

        // How many points have been added ?
        var length = directionPoints.length;

        // Find route if the point is greater than or equal to 2
        if (length >= 2) {

            // Take the last two items on the list
            var fromNodeID = directionPoints[length - 2].node_id;
            var toNodeID = directionPoints[length - 1].node_id;

            // Find the route with the nodeIDs
            findRoute(fromNodeID, toNodeID);
        }
    }
}


/**
 * Handles the general rendering of the point on the map
 *
 * To be worked on later by adding more listeners and bind popup

 * @param {number} node_id  -  Closest node id of the point
 * @param {Geojson} point - Point clicked on the map
 */
function renderDirectionPoint(node_id, point) {

    var addressOfMarker;

    // Create marker from Geojson
    marker = new L.marker([point.geometry.coordinates[1], point.geometry.coordinates[0]], {draggable: 'true'});

    //----------------------------------------

    // Add ondrag event.
    // TODO: Reroute!
    marker
        .on('drag', function (event) {

            var newMarker = event.target;
            var position = newMarker.getLatLng();
            marker.setLatLng(position);
            map.panTo(position);

        })

        .on('click', function (event) {
                var markerAddress;

                //Get Marker Coordinates
                const markerCoor = marker.getLatLng();

                //Get URL
                var url = getURLBackwardsGeocoder(markerCoor);

                // send Backwards Geocoding request
                $.getJSON(url, function (data, success) {
                    if (success == "success") {
                        var data2 = data['Response']['View']['0']['Result']['0'];

                        var currAddress = data2['Location']['Address'];
                        var matchLevel = data2['MatchLevel'];

                        //Address depending on MatchLevel of response MatchLevel
                        if (matchLevel == "county") {
                            markerAddress = currAddress['County'] + ", " + currAddress['State'];
                        }
                        if (matchLevel == "city") {
                            markerAddress = currAddress['City'] + ", " + currAddress['State'];
                        }
                        if (matchLevel == "district") {
                            markerAddress = currAddress['District'] + ", " + currAddress['City'];
                        }
                        if (matchLevel == "street") {
                            markerAddress = currAddress['Street'] + ", " + currAddress['District'] + ", " + currAddress['City'];
                        }
                        if (matchLevel == "houseNumber") {
                            markerAddress = currAddress['Street'] + ", " + currAddress['HouseNumber'] + ", " + currAddress['City'];
                        }

                        marker.bindTooltip("Node ID: " + node_id + " Address: " + markerAddress, {
                            direction: 'top',
                            permanent: true
                        });
                    }
                    else {
                        console.log("Get JSON: " + url_geocodrequest + " " + success);
                    }

                });
            }
        )


        // Simple tooltip
        .bindTooltip("Node ID: " + node_id, {direction: 'top', permanent: true});

//----------------------------------------

    directions.addLayer(marker);

//----------------------------------------

}

/**
 * Finds route between two points within the db network
 */
function findRoute(from_node_id, to_node_id) {

    nogoDijkstra();
    console.log("%cFinding route..................................", "background: green; color: white; font-size: large");
    console.log("From node ID: " + from_node_id + " ;\nTo node ID: ", to_node_id);

    console.log("%cAvailable nogo areas............................", "background: red; color: white; font-size: large");
    console.log(getAllNogoAreas());
}

/**
 * Refreshes the route if the nogo areas have been updated
 */
function refreshRoute() {

    console.log("%Refreshing route..................................", "background: green; color: white; font-size: large");

    console.log("%cAvailable nogo areas............................", "background: red; color: white; font-size: large");
    console.log(getAllNogoAreas());
}

/**
 * Renders the found route on the map
 */
function renderRoute(route) {

    L.geoJSON(route).addTo(map);

    // Clear previous guide layers 
    guides.clearLayers();

}


function setRoutingCapability(toggle) {
    routingCapability = toggle;
}

function getAllNogoAreas() {

    var allnogoareas = [];
    allnogoareas["polygon"] = turf.feature(getWKT(nogo_Poly, "polygon"));
    allnogoareas["linestring"] = turf.feature(getWKT(nogo_Line, "linestring"));

    return allnogoareas;
}

function getFromToPoints() {

    var dirPoints = [];
    dirPoints["from"] = directionPoints[0].node_id;
    dirPoints["to"] = directionPoints[1].node_id;
    return dirPoints;

}

/**
 * Returns an animated polyline from the last point in the direction point list.
 * @param {L.LatLng} latlng - point to draw the polyline to
 */

function getAntLineForLastDirPoint(to_latlng) {

    try {

        var lastPoint = directionPoints[directionPoints.length - 1];
        var latlngs = [lastPoint.latlng, to_latlng];

        var options = {delay: 300, dashArray: [10, 20], weight: 5, color: "darkblue", pulseColor: "#FFFFFF"};
        var path = L.polyline.antPath(latlngs, options);

        return path;

    } catch (error) {
        console.log(error);
    }
}

//Backwards Geocoder
function getURLBackwardsGeocoder(markerCoor) {
    //Access Credentials
    //Valid till March 8 2018
    var app_id = "VArrXyHCf6xwnR8Wwp5X";
    var app_code = "4PrsrNN9oitLO0DPSEncLg";

    var lat = markerCoor['lat'];
    var long = markerCoor['lng'];
    var coordinates = lat + "%2C" + long;

    //URL Request
    var url_geocodrequest =
        "https://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json?prox="
        + coordinates + "&mode=retrieveAddresses&maxresults=1&gen=1&app_id=" + app_id
        + "&app_code=" + app_code;

    return url_geocodrequest;
}


