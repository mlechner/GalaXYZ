<?php

	require("functions.php");
	$conn = dbconn();

	$x = $_GET['x'];
	$y = $_GET['y'];
	$node_id = 0;

	$param = "SRID=4326;POINT($x $y)";
	
	$sql = "SELECT
	id
	FROM
		ways_vertices_pgr
	ORDER BY
		ST_Distance(
			ways_vertices_pgr.the_geom,
			ST_GeomFromEWKT($1)
		) ASC
	LIMIT
		1;";

	$result = pg_query_params( $conn, $sql, array($param) ) or die('Query Failed: ' .pg_last_error());
	while( $row = pg_fetch_array( $result, null, PGSQL_ASSOC ) ) {
		$node_id = $row['id'];		
				
	}
	pg_free_result( $result );

	echo $node_id;
?>