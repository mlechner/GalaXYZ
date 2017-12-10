--DROP FUNCTION replace_cost(GEOMETRY);

CREATE OR REPLACE FUNCTION replace_cost_new(
    nogo_geom TEXT,
    edges TEXT,
    id_column TEXT,
    cost_column TEXT,
    reverse_cost_column TEXT,
    geom_column TEXT,

    OUT id BIGINT,
    OUT cost_s DOUBLE PRECISION,
    OUT reverse_cost_s DOUBLE PRECISION
)

	RETURNS SETOF RECORD AS

	$$
	BEGIN
	EXECUTE '
		SELECT
			' || quote_ident(id_column) || ' AS id,
			' || quote_ident(cost_column) || ' AS cost_s,
			' || quote_ident(reverse_cost_column) || ' AS reverse_cost_s
		FROM 
			'|| quote_ident(edges) || '
		WHERE 
			NOT ST_Intersects(' || nogo_geom || ', ' || quote_ident(geom_column) || ')

		UNION ALL

		SELECT
			' || quote_ident(id_column) || ' AS id,
			''INFINITY'' AS cost_s,
			''INFINITY'' AS reverse_cost_s
		FROM 
			' || quote_ident(edges) || '
		WHERE 
			ST_Intersects(' || nogo_geom || ', ' || quote_ident(geom_column) || ');
		';
	END
	$$

	LANGUAGE plpgsql;

SELECT * FROM pgr_dijkstra(
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
			replace_cost_new(
				''(SELECT geom FROM overwrite_poly)'',
				''ways'',
				''gid'',
				''cost_s'',
				''reverse_cost_s'',
				''the_geom''
			)
		) AS cost_replacement
	ON
		ways.gid = cost_replacement.id;
	',
	51982,
	5656);