SELECT json_build_object(
	'type',		'FeatureCollection',
	'features', 	jsonb_agg(feature)
)

FROM

(
SELECT json_build_object(
	'type',		'Feature',
	'id', 		id,
	'geometry',	ST_AsGeoJSON(geom)::json,
	'properties',	to_jsonb(row) - 'id' - 'geom'
)
AS
	feature

FROM

(
	SELECT
		route_result.edge AS id,
		ways.the_geom AS geom,
		ways.name AS name
	FROM
		pgr_dijkstra(
			'
			SELECT
				ways.gid AS id,
				ways.source AS source,
				ways.target AS target,
				cost_replacement.cost_s AS cost,
				cost_replacement.reverse_cost_s AS reverse_cost
			FROM
				ways
			JOIN
				( SELECT * FROM 
					replace_cost(
						ST_GeomFromText(
							''MULTIPOLYGON(((8.40226615336606 49.0079797109504,8.40234579778452 49.0104885101318,8.40676606300897 49.0103823175739,8.40668641859051 49.0078735183924,8.40668641859051 49.0078735183924,8.40226615336606 49.0079797109504)))'', 4326
						)
					)
				) AS cost_replacement
			ON
				ways.gid = cost_replacement.gid;
			',
			51982,
			5656
		)
	AS
		route_result
	INNER JOIN
		ways
	ON
		ways.gid = route_result.edge
) row) features;