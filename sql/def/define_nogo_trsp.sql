/* ========================================================================= */
/* ===== TRSP NO RESTRICTIONS DEFINITION =================================== */
/* ========================================================================= */

CREATE OR REPLACE FUNCTION pgr_nogo_trsp(
	edges_sql TEXT,
	nogo_geom GEOMETRY,
	start_vid INTEGER,
	end_vid INTEGER,
	directed BOOLEAN,
	has_rcost BOOLEAN,
	restrictions_sql TEXT DEFAULT NULL
)

RETURNS SETOF pgr_costResult AS

$$
BEGIN

DROP TABLE IF EXISTS edges_table;
DROP TABLE IF EXISTS edges_table_nogo;

/* Intercept the edges table that the pgr routing algorithm would normally work on, but make sure we have the geometry, too. */
EXECUTE 'CREATE TEMPORARY TABLE edges_table AS (' || edges_sql || ');';

IF has_rcost IS TRUE THEN

	/* Replace the cost columns with infinity where the geom intersects the nogo geom. */
	CREATE TEMPORARY TABLE
		edges_table_nogo
	AS (
		SELECT
			edges_table.id AS id,
			edges_table.source AS source,
			edges_table.target AS target,
			edges_table.cost AS cost,
			edges_table.reverse_cost AS reverse_cost
		FROM
			edges_table
		WHERE
			NOT ST_Intersects(nogo_geom, edges_table.geom)
			
		UNION ALL

		SELECT
			edges_table.id AS id,
			edges_table.source AS source,
			edges_table.target AS target,
			'INFINITY' AS cost,
			'INFINITY' AS reverse_cost
		FROM
			edges_table
		WHERE
			ST_Intersects(nogo_geom, edges_table.geom)

	);

	/* Now run the pgr routing algorithm on the updated table & return the result. */
	RETURN QUERY (
		SELECT * FROM pgr_trsp(
			'SELECT id, source, target, cost, reverse_cost FROM edges_table_nogo',
			start_vid,
			end_vid,
			directed,
			has_rcost
		)
	);

ELSE

	/* Replace the cost columns with infinity where the geom intersects the nogo geom. */
	CREATE TEMPORARY TABLE
		edges_table_nogo
	AS (
		SELECT
			edges_table.id AS id,
			edges_table.source AS source,
			edges_table.target AS target,
			edges_table.cost AS cost
		FROM
			edges_table
		WHERE
			NOT ST_Intersects(nogo_geom, edges_table.geom)
			
		UNION ALL

		SELECT
			edges_table.id AS id,
			edges_table.source AS source,
			edges_table.target AS target,
			'INFINITY' AS cost
		FROM
			edges_table
		WHERE
			ST_Intersects(nogo_geom, edges_table.geom)

	);

	/* Now run the pgr routing algorithm on the updated table & return the result. */
	RETURN QUERY (
		SELECT * FROM pgr_trsp(
			'SELECT id, source, target, cost FROM edges_table_nogo',
			start_vid,
			end_vid,
			directed,
			has_rcost
		)
	);

END IF;

END
$$
LANGUAGE plpgsql;

/* ========================================================================= */
/* ===== TRSP NO RESTRICTIONS TEST ========================================= */
/* ========================================================================= */

SELECT
	*
FROM
	pgr_nogo_trsp(
		'SELECT gid::INTEGER AS id, source::INTEGER, target::INTEGER, cost, the_geom AS geom FROM ways',
		(SELECT ST_Union(geom) FROM overwrite_poly),
		1,
		2,
		TRUE,
		FALSE
	);
