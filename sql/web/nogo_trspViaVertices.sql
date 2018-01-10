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
		FROM pgr_nogo_trspViaVertices(
				'SELECT gid::INTEGER AS id, source::INTEGER, target::INTEGER, cost::FLOAT8, reverse_cost::FLOAT8, the_geom AS geom FROM ways',
				(
					SELECT
						ST_SetSRID(ST_Union(ST_GeomFromGeoJSON(feat->>'geometry')), 4326)
					FROM (
						SELECT json_array_elements(
							/* GEOJSON STARTS HERE */
							'{
								"type": "FeatureCollection",
								"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
								"features":
									[
										{ "type": "Feature", "properties": { "id": null }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 8.401442639170414, 49.011205524338543 ], [ 8.403872520648662, 49.011086021970762 ], [ 8.403806130444337, 49.006983107343551 ], [ 8.401230190516577, 49.007076053629604 ], [ 8.401442639170414, 49.011205524338543 ] ] ] } },
										{ "type": "Feature", "properties": { "id": null }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 8.400446786105556, 49.010475232090982 ], [ 8.400367117860368, 49.012387269975505 ], [ 8.405412773388973, 49.012121709158208 ], [ 8.405054266285624, 49.010143281069361 ], [ 8.400446786105556, 49.010475232090982 ] ] ] } }
									]
							}'
							/* GEOJSON ENDS HERE */
							::json->'features'
						) AS
							feat
					) AS
						f
				),
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

