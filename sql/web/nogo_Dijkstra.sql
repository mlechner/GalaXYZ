SELECT json_build_object(
	'type',		'FeatureCollection',
	'features', 	jsonb_agg(feature)
)

FROM

(
SELECT json_build_object(
	'type',		'Feature',
	'id', 		edge,
	'geometry',	ST_AsGeoJSON(the_geom)::json,
	'properties',	to_jsonb(row) - 'id' - 'geom'
)
AS
	feature

FROM
	(
		SELECT * FROM pgr_nogo_Dijkstra(
			'ways',
			'gid',
			'source',
			'target',
			'cost_s',
			'reverse_cost_s',
			'
			SELECT ST_SetSRID(ST_Collect(ST_GeomFromGeoJSON(feat->>''geometry'')), 4326)
			FROM (
				SELECT json_array_elements(''{
					"type": "FeatureCollection",
					"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC::CRS84" } },
															
					"features": [
						{ "type": "Feature", "properties": { "id": 1 }, "geometry": { "type": "Polygon", "coordinates": [ [ [ 8.402266153366059, 49.007979710950366 ], [ 8.402345797784518, 49.010488510131815 ], [ 8.406766063008972, 49.010382317573871 ], [ 8.406686418590514, 49.007873518392422 ], [ 8.406686418590514, 49.007873518392422 ], [ 8.402266153366059, 49.007979710950366 ] ] ] } }
					]
				}''::json->''features'') AS feat
			) AS f
			',
			15997,
			4793,
			FALSE
		) AS route_result
		INNER JOIN
			ways
		ON
			ways.gid = route_result.edge
	)

row) features;

