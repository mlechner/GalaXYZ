/*
Query to return the id of the closest node in the ways_vertices_pgr table.
Use this query to get the ids required for routing start/stop locations.
*/

SELECT
	id/*,
	ST_AsGeoJSON(ST_ClosestPoint(ways_vertices_pgr.the_geom, ST_GeomFromEWKT('SRID=4326;POINT(8.402266 49.007979)'))) AS geom*/
FROM
	ways_vertices_pgr
ORDER BY
	ST_Distance(
		ways_vertices_pgr.the_geom,
		ST_GeomFromEWKT('SRID=4326;POINT(8.402266 49.007979)') /* Put user click coordinates here */
	) ASC
LIMIT
	1;