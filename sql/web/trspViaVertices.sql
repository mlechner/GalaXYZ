SELECT json_build_object(
	'type',		'FeatureCollection',
	'features', 	jsonb_agg(feature)
)
FROM (
	SELECT json_build_object(
		'type',		'Feature',
		'id', 		gid,
		'geometry',	ST_AsGeoJSON(geom)::json,
		'properties',	to_jsonb(row) - 'id' - 'geom'
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
		FROM pgr_trspViaVertices(
				'SELECT gid::INTEGER AS id, source::INTEGER, target::INTEGER, cost::FLOAT8, reverse_cost::FLOAT8 FROM ways',
				ARRAY[4678,9415,27878,41264], /* PUT NODE IDS HERE IN ORDER */
				TRUE,
				TRUE
			) AS route_result
		INNER JOIN
			ways
		ON
			ways.gid = route_result.id3
	)
row) features;

