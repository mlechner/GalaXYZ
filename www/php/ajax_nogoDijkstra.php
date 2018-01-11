<?php
	
	//includes the functions from 'functions.php' for the database connection
	require("functions.php");
	//creates the connection
	$conn = dbconn();

	$geoms1 = $_POST['data']; //geometry 'POST' data passed from ajax
	$nodes1 = $_POST['nodes']; //node id of the 'from' location, passed from ajax
	//$to = $_POST['to']; //node id of the 'to' location, passed from ajax

	$geoms = json_decode($geoms1, true); //makes the geoms1 a php array
	$nodes = json_decode($nodes1, true);

	$FeatureCollection = ""; //declare the feature collection variable

	$count = 0;
	//for each geometry (NoGo polygon):
	for ($x = 0; $x < sizeof($geoms); $x++){
		//remove the leaflet id from the array
		unset($geoms[$x]["id"]);
		//for every geometry except the first one
		if ($count > 0){
			//prepend a comma separator to separate the features
			$FeatureCollection.= ", ";
		}
		//add the geometry to the feature collection
		$FeatureCollection.= json_encode($geoms[$x]);
		$count += 1;
	}

	
	//sql function calling the nogo_Dijkstra function from the DB
	$sql = 'SELECT json_build_object(
			\'type\',		\'FeatureCollection\',
			\'features\', 	jsonb_agg(feature)
		)
		FROM (
			SELECT json_build_object(
				\'type\',		\'Feature\',
				\'id\', 		gid,
				\'geometry\',	ST_AsGeoJSON(geom)::json,
				\'properties\',	to_jsonb(row) - \'id\' - \'geom\'
		) AS
			feature
		FROM
			(
				SELECT
					seq AS gid,
					route_result.id1 AS route_id,
					route_result.id3 AS edge_id,
					ways.name,
					the_geom AS geom
				FROM pgr_nogo_trspViaVertices(
						\'SELECT gid::INTEGER AS id, source::INTEGER, target::INTEGER, cost::FLOAT8, reverse_cost::FLOAT8, the_geom AS geom FROM ways\',
						(
							SELECT
								ST_SetSRID(ST_Union(ST_GeomFromGeoJSON(feat->>\'geometry\')), 4326)
							FROM (
								SELECT json_array_elements(
									\'{
										"type": "FeatureCollection",
										"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
										"features":
											['.$FeatureCollection.']
									}\'
									::json->\'features\'
								) AS
									feat
							) AS
								f
						),
						ARRAY'.json_encode($nodes).',
						TRUE,
						TRUE
					) AS route_result
				INNER JOIN
					ways
				ON
					ways.gid = route_result.id3
			)
		row) features;
		';

	$result = pg_query( $sql ) or die('Query Failed: ' .pg_last_error());
	
	$finalvalue = pg_fetch_result($result, 0, 0);
    echo $finalvalue; //send result back to web page*/
	

?>