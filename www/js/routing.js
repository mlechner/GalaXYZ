/**
* Handles the routing request and rendering protocol
* *
* @author: enocholumide
*/
//------------------------------------------------------------------------------

var directionPoints = [];
var reroute = false;
var routingCapability = false;


function initRouting(){

	directions = new L.FeatureGroup();
	routingCapability = true;

	map.addLayer(directions);
}

/**
* Add a direction point
* 
* @param {int} x - Lon
* @param {int} y  -lat
*  
*/
function addDirectionPoint(x,y){

	if(routingCapability){

		console.log("Processing route!");

		var point = turf.point([x,y]);

		if(directionPoints.length == 0){

			if(reroute) {

				// Clear the markers and the route
				directions.clearLayers();

			}
			reroute = false;

			// Add marker and find NO route!
			directionPoints.push(point);
			renderDirectionPoint(point);
		} 

		else if(directionPoints.length == 1) {
			
			// Clear markers and route
			directionPoints.push(point);
			renderDirectionPoint(point);

			findRoute(directionPoints[0], directionPoints[1]);

			// Clear array -> this way, the array stays with a length of 2
			directionPoints = [];

			// Prepare for re-routing
			reroute = true;

		}

		if(directionPoints.length > 2) {

			console.log("%cFATAL Something went wrong, the directionPoints array cannot be tracked, length is more than 2 ", "background: red; color: white; font-size: x-large");
		}
	} // if routing capabilty is enabled

	else
		console.log("%Something went wrong, routing capability for this program might not have been enabled, ensure the initRouting function is properly configured",  "background: red; color: white; font-size: large");

} // Add direction point



function renderDirectionPoint(point){

	var marker = L.geoJSON(point);
	directions.addLayer(marker);
}

/**
* Finds route between two points within the db network
*/
function findRoute(from, to){

	console.log("%cFinding route..................................", "background: green; color: white; font-size: large");
	console.log(getFromToPoints());

	console.log("%cAvailable nogo areas............................", "background: red; color: white; font-size: large");
	console.log(getAllNogoAreas());
}

/**
* Refreshes the route if the nogo areas have been updated
*/
function refreshRoute(){

	console.log("%Refreshing route..................................", "background: green; color: white; font-size: large");

	console.log("%cAvailable nogo areas............................", "background: red; color: white; font-size: large");
	console.log(getAllNogoAreas());
}

/**
* Renders the found route on the map
*/
function renderRoute(routeArray){

}


function setRoutingCapability(toggle){
	routingCapability = toggle;
}

function getAllNogoAreas(){

	var allnogoareas = [];
	allnogoareas["polygon"] = turf.feature(getWKT(nogo_Poly, "polygon"));
	allnogoareas["linestring"] = turf.feature(getWKT(nogo_Line, "linestring"));

	return allnogoareas;
}

function getFromToPoints(){

	var dirPoints = [];
	dirPoints["from"] = directionPoints[0]; 
	dirPoints["to"] = directionPoints[1]; 
	return dirPoints;
}