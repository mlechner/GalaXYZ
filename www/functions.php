<?php
	session_start();
	ini_set('display_errors', 1); // Dispalys errors

	function dbconn(){

		ini_set('display_errors', 1); // Dispalys errors
		// fetch config params
		$config = file_get_contents('config.json');
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
	}
	
?>