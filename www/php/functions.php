<?php
	session_start();
	//ini_set('display_errors', 1); // Dispalys errors
	/**
	*Creates a connection to the database	*
	*/
	function dbconn(){

		ini_set('display_errors', 1); // Dispalys errors
		// fetch config params
		$config = file_get_contents('../config.json');
		$json = json_decode($config, true);
		//echo $json['db_host'];


		//database login info
		$host = $json['db_host'];
		$port = $json['db_port'];
		$dbname = $json['db_name'];
		$user = $json['db_user'];
		$password = $json['db_pwd'];
		// establish connection 		
		$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
		if (!$conn) {
			echo "Not connected : " . pg_error();
			exit;
		}
		return $conn;
	}

	/*
	* extracts and a zip file from upload into the upload/ folder
	* removes the directory structure so olny files are present
	*/
	function zip_flatten ( $zipfile, $dest='.' ) { 
		$zip = new ZipArchive; 
		if ( $zip->open( $zipfile ) ) { 
			for ( $i=0; $i < $zip->numFiles; $i++ ) { 
				$entry = $zip->getNameIndex($i); 
				if ( substr( $entry, -1 ) == '/' ) continue; // skip directories 

				$fp = $zip->getStream( $entry ); 
				$ofp = fopen( $dest.'/'.basename($entry), 'w' ); 

				if ( ! $fp ) 
					throw new Exception('Unable to extract the file.'); 

				while ( ! feof( $fp ) ) 
					fwrite( $ofp, fread($fp, 8192) ); 

				fclose($fp); 
				fclose($ofp); 
			} 
			$zip->close(); 
		} 
		else 
			return false; 
		return $zip; 
	} 
	/*
	* clears all files in the upload/ folder
	*/
	function clear_upload(){
		$files = glob('upload/*');
		foreach($files as $file){
			if(is_file($file))
			unlink($file); //delete file
		}
	}

	function to_pg_array($set) {
        settype($set, 'array'); // can be called with a scalar or array
        $result = array();
        foreach ($set as $t) {
            if (is_array($t)) {
                $result[] = to_pg_array($t);
            } else {
                $t = str_replace('"', '\\"', $t); // escape double quote
                if (! is_numeric($t)) // quote only non-numeric values
                    $t = '"' . $t . '"';
                $result[] = $t;
            }
        }
        return '{' . implode(",", $result) . '}'; // format
    }
	
?>