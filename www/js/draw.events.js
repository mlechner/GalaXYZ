/**
* Handles the draw events from the leaflet plugin
* If the plugin is not originally initialised, nothing happens
*
* @author: enocholumide
*/
//------------------------------------------------------------------------------

/**
* Registers draw events on the map from the leaflet draw control plugin
*  
*/

var nogo_Poly = [];
var nogo_Line = [];


function registerDrawEvents(){

	// Check if a draw control have been added or not

	if(drawControl){

		console.log("Registering draw events on the map");
		
		map.on(L.Draw.Event.CREATED, e => onDrawCreated(e));
		map.on(L.Draw.Event.EDITED, e => onDrawEdited(e));
		map.on(L.Draw.Event.DELETED, e => onDrawDeleted(e));

	} 

  else
		console.error("Draw control might not have been initialised on the map");
}


/**
* Event for draw created
* @param {Object} e - Leaflet draw event layer
*/
function onDrawCreated(e) {

	console.log("Draw created");

	var layer = e.layer;
  var type = e.layerType;

  // Protocol if the user draws a polygon on the map

  if (type.toUpperCase() === 'POLYGON' || type.toUpperCase() === 'RECTANGLE') {

    	// Display drawn polygon on the map
    	// Note nogoAreas is a feature collection already attached to the map
     	nogoAreas.addLayer(layer);

     	var coordsRefined = getFormatedCoords(layer);

     	// Create a turf polygn and add the leaflet layer id
     	var turfPoly = getTurfPolygon(coordsRefined, layer._leaflet_id);

     	// Add to nogo-areas list
     	//plotlayers.push(turfPoly);
      nogo_Poly.push(turfPoly);

     	// Construct a WKT of all the polygons
     	console.log((getWKT(nogo_Poly, "Polygon")));

  } // End polygon protocol


  // Protocol if the user draws a polyline on the map

  if(type.toUpperCase() === 'POLYLINE'){

      // Display drawn polygon on the map
      // Note nogoAreas is a feature collection already attached to the map
      nogoAreas.addLayer(layer);

      // Create a turf linestring and add the leaflet layer id
      var turfLineString = getTurfLineString(layer, layer._leaflet_id);

      // Add to nogo-areas list
      nogo_Line.push(turfLineString);

      // Construct a WKT of all the lines
      console.log((getWKT(nogo_Line, "LineString")));

   } // End polyline protocol

   // Protocol for drawing points for routing
   // This protocol is transfered to the routing.js -> /js/routing.js

   if((e.layerType).toUpperCase() === "MARKER"){

      console.log(layer.getLatLng());
      addDirectionPoint(layer.getLatLng().lng, layer.getLatLng().lat);
   }

}

/**
* Event for draw edited
* Will only treat item edited on the layer list
* Computes the new geometry and replaces it at the plotlayers array 
* @param {Object} e - Leaflet draw event layer
*/

function onDrawEdited(e){

	console.log("Draw edited");
	var layers = e.layers;
  

    layers.eachLayer(function (layer) {

      // Check if the edited item is a polygon item
      var index = nogo_Poly.map(function(e) { return e.id; }).indexOf(layer._leaflet_id);

      if(index >= 0){

        // Means Polygon
        var coordsRefined = getFormatedCoords(layer);

        // Re-create the polygn
        var turfPoly = getTurfPolygon(coordsRefined, layer._leaflet_id);

        // Replace the edited feature in the list
        nogo_Poly[index] = turfPoly;
        console.log("Polygon/ Rectangle replaced")

      } else {

        // Means polyline
        index = nogo_Line.map(function(e) { return e.id; }).indexOf(layer._leaflet_id);

        // Re-confirm
        if(index >= 0) {

          // Re-create the line
          var turfLineString = getTurfLineString(layer, layer._leaflet_id);

          // Replace the edited feature in the list
          nogo_Line[index] = turfLineString;
          console.log("LineString replaced");

        } else {

          // It normally should not get to this stage, just doing this to keep track of things, in case!
          console.error("FATAL: An error has occured, cannot keep track of the just edited item");
        }

      }

  });

}

/**
* Event for draw edited
* Will only treat item edited on the layer list
* Computes the new geometry and replaces it at the plotlayers array 
* @param {Object} e - Leaflet draw event layer
*/

function onDrawDeleted(e){

	console.log("Draw deleted");

	var layers = e.layers;

	layers.eachLayer(function (layer) {

		// Find index of the item deleted
       	var index = plotlayers.map(function(e) { return e.id; }).indexOf(layer._leaflet_id);

       	// Remove it from the plot layer array
       	plotlayers.splice(index, 1);

    });

    console.log(plotlayers);
}


// ---------------------------------------------------------
//                      ASSISTING FUNCTIONS
// ---------------------------------------------------------

/**
* Refines the coordinates generated from the draw events and 
* gets it ready to be converted to polygon format
* @param {Object} layer - Leaflet layer
* @return {Array} coordinates array in leaflet lat lng format 
*/
function getFormatedCoords(layer){


	var coords = layer.getLatLngs()[0];


    // Remove duplicates 
    var coordsRefined = coords;
    for(var ii = 0 ; ii < coords.length; ii++){

        for(var jj = 0 ; jj < coords.length; jj++){
            
            if(jj != ii){
                
                if(coords[jj].lat == coords[ii].lat && coords[jj].lng == coords[ii].lng){
                    coordsRefined.splice(jj, 1);
                }
            } 
        }
    }

   // Close the polygon by adding the first coords to the last index.
   coordsRefined.push(coordsRefined[0]);

   return coordsRefined;
}

/**
* Refines the coordinates generated from the draw events and 
* gets it ready to be converted to polygon format
* @param {Object} layer - Leaflet layer
* @param {int} id - leaflet id of the original layer
* @return {Geojson} polygon in geojson format
*/
function getTurfPolygon(coordsRefined, leaflet_id){

	// Format coords to turf index
    var turfCoords = [];

   	for(var ii = 0; ii < coordsRefined.length; ii++){
        //Turf uses lng, lat
        turfCoords[ii] = [ coordsRefined[ii].lng, coordsRefined[ii].lat ];
   	}

   	// Construct a turf polygon <- geojson
   	var turfPoly = turf.polygon([turfCoords]);

   	// Add a tag to the new polygon, this is useful when the the user deletes a polygon
   	turfPoly["id"] = leaflet_id;

   	return turfPoly;
}

/**
* Creates a turf line string from a leaflet layer
* @param {Object} layer - Leaflet layer
* @param {int} id - leaflet id of the original layer
* @return {Geojson} linestring in geojson format
*/
function getTurfLineString(layer, leaflet_id){

  // Extract coordinates
  var coordsArray = [];
  for(var ii = 0; ii < layer.getLatLngs().length; ii++){
    // Turf coords starts from lng then lat
    coordsArray.push([layer.getLatLngs()[ii].lng, layer.getLatLngs()[ii].lat]);
  }

  // Create a turf line string from the coords array and add its leaflet id for referencing
  var turfLineString = turf.lineString(coordsArray);
  turfLineString["id"] = leaflet_id;

  return turfLineString;
}

