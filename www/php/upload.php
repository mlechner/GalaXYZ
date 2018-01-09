<?php
	
	/**
	*
	* Called as an AJAX query
	* handles the upload of a shapefile
	*
	* @author: RobCoppinger
	*
	* NOTE: 
	* $ ~ sudo chmod 777 -R /path/to/upload
	* This cmd line must be run first.
	* it allows read/write permission to the upload file
	*
	* $ ~ sudo apt-get install php-zip 
	* $ ~ sudo service apache2 restart
	* installs the dependency for extracting zip files
	*/

	require('functions.php');

	//ini_set('display_errors', '1');
	// flags for validation
	$shp = 0;
	$shx = 0;
	$dbf = 0;
	$zip = 0;
	$json = 0;
	$name = "";

	//Loop through all the files passed by AJAX
	foreach($_FILES as $index => $file){

		$fileName = $file['name'];
		$sourcePath = $file['tmp_name']; 	
		$targetPath = "upload/".$file['name'];
		$fileType = strtolower(pathinfo($fileName,PATHINFO_EXTENSION));

		//if zip file uploaded
		if ($fileType == 'zip'){
			//extract zip, flatten directory structure,
			//move to upload dir
			if(zip_flatten($file['tmp_name'], 'upload/')){
				$zip = 1; //set zip flag to true
			}			
		} else if ($fileType == 'json'){
			move_uploaded_file($file["tmp_name"], $targetPath);
			$json = 1;

		} else {
			//files uploaded (not as zip)
			//move files from temp to upload folder
			move_uploaded_file($file["tmp_name"], $targetPath);
			if($fileType == 'shp'){$shp = 1; $name = $fileName;}
			//set flags
			if($fileType == 'shx'){$shx = 1;}
			if($fileType == 'dbf'){$dbf = 1;}			
		}

	}
	//validate successful upload
	$verify = $shp + $shx + $dbf;
	if ($zip == 1 || $verify == 3){
		echo 1;
	} else if ($json == 1) {
		echo 2;
	} else {
		//clear the upload folder
		clear_upload();
		echo 0;
	}
	
?>