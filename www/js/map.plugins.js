/**
* Add needed plugins to the leaflet map
* If the leaflet map is not originally initialised, nothing happens
*
* @author: enocholumide
*/

//------------------------------------------------------------------------------

var nogoAreas = new L.FeatureGroup();
var drawControl;


/**
* Add needed plugins to the map
* If the leaflet map is not originally initialised, nothing happens
*/

function addAllMapPlugins(){

	if(map){

		map.addLayer(nogoAreas);

		console.log("Adding leaflet draw control plugin");
		drawControl = getDrawControlPlugin(nogoAreas);
		map.addControl(drawControl);

	} else{
		console.log("The 'map' variable doesn't exist or have not been initialised");
	}

}

/**
* Creates a leaflet draw control with all its customised settings
* @param {L.FeatureGroup} layer - Leaflet feature group the plugin should draw into <-- this should be added to the map before hand in order to display on the map
* @return {L.DrawControl} drawControl - Returns leaflet draw control  with all its customised settings
*/

function getDrawControlPlugin(layer){

	 var drawControl = new L.Control.Draw({
	      position:'topright',
	      draw: {polygon:true, rectangle:false, circle:false, polyline:true, marker:false},
	      edit: {featureGroup: layer}
	  });

	return drawControl;
}