--DROP FUNCTION replace_cost(GEOMETRY);

CREATE OR REPLACE FUNCTION replace_cost(
    in_geom GEOMETRY
)

	RETURNS TABLE(
		gid BIGINT,
		name VARCHAR(255),
		cost_s DOUBLE PRECISION,
		reverse_cost_s DOUBLE PRECISION
	) AS

	$$
		SELECT
			gid AS gid,
			name AS name,
			cost_s AS cost_s,
			reverse_cost_s AS reverse_cost_s
		FROM
			ways
		WHERE 
			NOT ST_Intersects(in_geom, the_geom)

		UNION ALL

		SELECT
			gid AS gid,
			name AS name,
			'INFINITY' AS cost_s,
			'INFINITY' AS reverse_cost_s
		FROM
			ways
		WHERE 
			ST_Intersects(in_geom, the_geom)
	$$

	LANGUAGE SQL;

 /* https://gis.stackexchange.com/questions/262474/pass-geometry-as-input-to-custom-postgis-function/262501
 http://www.postgresonline.com/journal/archives/201-Using-RETURNS-TABLE-vs.-OUT-parameters.html */

/*
							WITHOUT NOGO:
*/
/* SELECT edge FROM pgr_dijkstra(
	'
	SELECT
		ways.gid AS id,
		ways.source AS source,
		ways.target AS target,
		ways.cost_s AS cost,
		ways.reverse_cost_s AS reverse_cost
	FROM
		ways
	',
	51982,
	5656
) */

/*
							WITH NOGO:
*/
/*SELECT edge FROM pgr_dijkstra(
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
	5656);*/