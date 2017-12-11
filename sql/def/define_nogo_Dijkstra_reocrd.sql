CREATE OR REPLACE FUNCTION pgr_nogo_Dijkstra_record (
	edges_table TEXT,
	id_column TEXT,
	source_column TEXT,
	target_column TEXT,
	cost_column TEXT,
	reverse_cost_column TEXT,
	nogo_sql TEXT,
	start_vid BIGINT,
	end_vid BIGINT,
	directed BOOLEAN,

	OUT seq INTEGER,
	OUT path_seq INTEGER,
	OUT node BIGINT,
	OUT edge BIGINT,
	OUT cost FLOAT,
	OUT agg_cost FLOAT
)

	RETURNS SETOF RECORD AS
		$BODY$
			SELECT
				a.seq,
				a.path_seq,
				a.node,
				a.edge,
				a.cost,
				a.agg_cost
			FROM
				pgr_dijkstra(
					'
						SELECT
							' || edges_table || '.' || id_column || ' AS id,
							' || edges_table || '.' || source_column || ' AS source,
							' || edges_table || '.' || target_column || ' AS target,
							cost_replacement.' || cost_column || ' AS cost,
							cost_replacement.' || reverse_cost_column || ' AS reverse_cost
						FROM
							' || edges_table || '
						JOIN
							( SELECT * FROM 
								replace_cost((' || nogo_sql || '))
							) AS cost_replacement
						ON
							' || edges_table || '.' || id_column || ' = cost_replacement.' || id_column || ';
					',
					start_vid,
					end_vid,
					directed
				)
			AS 
				a;
		$BODY$
	LANGUAGE SQL VOLATILE
	COST 100
	ROWS 1000;

SELECT * FROM pgr_nogo_Dijkstra_record (
	'ways',
	'gid',
	'source',
	'target',
	'reverse_cost_s',
	'cost_s',
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
	51982,
	5656,
	TRUE
);