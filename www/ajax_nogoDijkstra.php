<?php

	require("functions.php");
	$conn = dbconn();

	$geoms1 = $_POST['data'];
	$from = $_POST['from'];
	$to = $_POST['to'];

	$geoms = json_decode($geoms1, true);

	$FeatureCollection = "";

	$count = 0;
	for ($x = 0; $x < sizeof($geoms); $x++){
		unset($geoms[$x]["id"]);
		if ($count > 0){
			$FeatureCollection.= ", ";
		}
		$FeatureCollection.= json_encode($geoms[$x]);
		$count += 1;
	}
	
	$sql = 'SELECT * FROM pgr_nogo_Dijkstra(
		\'ways\',
		\'gid\',
		\'source\',
		\'target\',
		\'cost_s\',
		\'reverse_cost_s\',
		\'
		SELECT ST_SetSRID(ST_Collect(ST_GeomFromGeoJSON(feat->>\'\'geometry\'\')), 4326)
		FROM (
			SELECT json_array_elements(\'\'{
				"type": "FeatureCollection",
				"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC::CRS84" } },
														
				"features": ['.$FeatureCollection.']
			}\'\'::json->\'\'features\'\') AS feat
		) AS f
		\',
		'.$from.',
		'.$to.',
		FALSE
	);';
	
	$edges = [];
	$result = pg_query( $sql ) or die('Query Failed: ' .pg_last_error());
	while( $row = pg_fetch_array( $result, null, PGSQL_ASSOC ) ) {
		array_push($edges, $row['edge']);		
				
	}
	pg_free_result( $result );

	echo json_encode($edges);

?>