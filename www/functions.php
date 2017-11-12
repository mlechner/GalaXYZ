<?php
	session_start();
	ini_set('display_errors', 1); // Dispalys errors

	function dbconn(){
		//database login info
		$host = 'localhost';
		$port = '5432';
		$dbname = 'galaxyz';
		$user = 'postgres';
		$password = 'GalaXYZ_pwd';
		// establish connection
		$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");
		if (!$conn) {
			echo "Not connected : " . pg_error();
			exit;
		}
	}
	
?>