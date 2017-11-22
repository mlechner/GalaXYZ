/**
* General functions needed for the map rendering and associated functions
* *
* @author: enocholumide
*/

//------------------------------------------------------------------------------

/**
* General functions needed for the map rendering and associated functions
* Supports only feature type of Polygon, for now.
* @param {Array} list List of features
* @param {String} type Type of WKT wanted e.g Polygon
* @return {String} featureWKT WKT representation of all the features in the array list 
*/
function getWKT(list, type){
    //-------------------
    // Turf lat and lng index
    //--------------------
    var latIndex = 1;
    var lonIndex = 0;
    //--------------------

    // e.g ""POLYGON(""
    var featureWKT = type.toUpperCase() + "(";
    var separator = ",";

    for(var ii = 0; ii < list.length; ii++) {
        if(ii == list.length - 1){
            separator = "";
        }
        var feature = list[ii];
        var featureType = (feature.geometry.type).toUpperCase();
        
        featureWKT += (processFeature(feature, featureType)) + separator;
               
    }

    featureWKT += ")";
    //console.log(featureWKT);
    return featureWKT;

    /**
    * Process a single feature in the array
    * @param {Geojosn} Feature (polygon)
    * @param {String} type Type of WKT wanted e.g Polygon
    * @return {String} geomWKT WKT representation of the feature
    */
    function processFeature(feature, type){
        var geomWKT = null;
        //poly = GEOM.fromWKT("POLYGON((1 1,5 1,5 5,1 5,1 1),(2 2, 3 2, 3 3, 2 3,2 2))");

        if(type.toUpperCase() === "POLYGON"){
            
            console.log("Processing polygon");
            
            var separator = ",";

            for(var jj = 0; jj < feature.geometry.coordinates.length; jj++){
                geomWKT = "(";
                var coords = feature.geometry.coordinates[jj];
                for(var ii = 0; ii < coords.length; ii++){
                    
                    if(ii === (coords.length - 1)){
                        separator = "";
                    }
                    geomWKT += coords[ii][lonIndex] + " " + coords[ii][latIndex] + separator;
                }
                
                // Close writting
                geomWKT += ")";
            }
        } // End polygon

        if(type.toUpperCase() === "LINESTRING"){

            console.log("Processing linestring");

            var separator = ",";

            for(var jj = 0; jj < feature.geometry.coordinates.length; jj++){
                geomWKT = "(";
                var coords = feature.geometry.coordinates[jj];

                if(jj === (coords.length - 1)){
                    separator = "";
                }
                geomWKT += coords[lonIndex] + " " + coords[latIndex] + separator;
                
                // Close writting
                geomWKT += ")";
            }
        }

        return geomWKT;
    
    } // End linestring
}


