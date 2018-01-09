<?php
	/**
	* Called as an AJAX query
	* Handles the conversion of shapefiles to GeoJSON from the upload/folder
	*
	* @author: RobCoppinger
	*/
	//------------------------------------------------------------------------------

	require ('functions.php');
	$Name = "";
	$files = scandir('upload/'); //scan files in upload dir
	foreach ($files as $file) {
		//if file name contains 'shp' then use this as the file name
		if (strpos($file, 'json') !== false) {
			$Name = $file;
		}
	}

	$myfile = fopen("upload/".$Name, "r") or die(false);
	if ($myfile != false){
		$JSONreturn = fread($myfile,filesize("upload/".$Name));
		fclose($myfile);
		clear_upload(); 
		echo json_encode($JSONreturn);
	} else {
		echo false;
	}
	
	
?>