<?php
	/**
	* Called as an AJAX query
	* Handles the conversion of shapefiles to GeoJSON from the upload/folder
	*
	* @author: RobCoppinger
	*/
	//------------------------------------------------------------------------------

	require ('functions.php');

	$Name = ""; //Name of the files
	//ini_set('display_errors', '1');
	require_once('php-shapefile/src/ShapeFileAutoloader.php'); //shapefile library
	\ShapeFile\ShapeFileAutoloader::register();
	// Import classes
	use \ShapeFile\ShapeFile;
	use \ShapeFile\ShapeFileException;

	$files = scandir('upload/'); //scan files in upload dir
	foreach ($files as $file) {
		//if file name contains 'shp' then use this as the file name
		if (strpos($file, 'shp') !== false) {
			$Name = $file;
		}
	}	

	$JSONreturn = '{ "type": "FeatureCollection","features": [';
	$count = 0;
	try {
	    // Open shapefile
	    $ShapeFile = new ShapeFile('upload/'.$Name);
	    
	    // Read all the records
	    while ($record = $ShapeFile->getRecord(ShapeFile::GEOMETRY_GEOJSON_FEATURE)) {
	        if ($record['dbf']['_deleted']) continue;
	        // Geometry
	        if ($count >0){$JSONreturn.=",";} //add ', ' to separate each entry
	        $JSONreturn.= $record['shp']; //add the geojson value to $JSONreturn
	        $count += 1;
	    }
	    $JSONreturn.= ']}'; //close the GeoJSON
	    
	
	} catch (ShapeFileException $e) {
	    // Print detailed error information
	    exit('Error '.$e->getCode().' ('.$e->getErrorType().'): '.$e->getMessage());
	}
	//deletes all files in the upload dir
	//function coded in functions.php
	clear_upload(); 
	//return the GeoJSON of the shapefile
	echo json_encode($JSONreturn);
	
?>