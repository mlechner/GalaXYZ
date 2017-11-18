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
function registerDrawEvents(){

	// Check if a draw control have been added or not
	if(drawControl){

		console.log("Registering draw events on the map");
		
		map.on(L.Draw.Event.CREATED, e => onDrawCreated(e));
		map.on(L.Draw.Event.EDITED, e => onDrawEdited(e));
		map.on(L.Draw.Event.DELETED, e => onDrawDeleted(e));


	} else
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
    if (type.toUpperCase() === 'POLYGON') {

    	// Display drawn polygon on the map
    	// Note nogoAreas is a feature collection already attached to the map
       	nogoAreas.addLayer(layer);

       	var coordsRefined = getFormatedCoords(layer);

       	// Create a turf polygn
       	var turfPoly = getTurfPolygon(coordsRefined, layer._leaflet_id);

       	// Add to layer
       	plotlayers.push(turfPoly);

       	// Construct a WKT of all the polygons in the list
       	//console.log(getWKT(plotlayers, "pOlyGon"));

       	console.log(plotlayers);
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

        var coordsRefined = getFormatedCoords(layer);

        // Create a turf polygn
       	var turfPoly = getTurfPolygon(coordsRefined, layer._leaflet_id);

       	var index = plotlayers.map(function(e) { return e.id; }).indexOf(layer._leaflet_id);
       	plotlayers[index] = turfPoly;

        console.log(plotlayers);

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
function getTurfPolygon(coordsRefined, id){

	// Format coords to turf index
    var turfCoords = [];

   	for(var ii = 0; ii < coordsRefined.length; ii++){
        //Turf uses lng, lat
        turfCoords[ii] = [ coordsRefined[ii].lng, coordsRefined[ii].lat ];
   	}

   	// Construct a turf polygon <- geojson
   	var turfPoly = turf.polygon([turfCoords]);

   	// Add a tag to the new polygon, this is useful when the the user deletes a polygon
   	turfPoly["id"] = id;

   	return turfPoly;
}