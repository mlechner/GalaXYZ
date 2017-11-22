/*
Example function that will return the cost columns from the ways table, but set the cost and reverse_cost
columns to Infinity if the record matches a certain criteria (in this case, if the class_id column is equal
to the function call's input).  I don't know how having Infinity in the cost/reverse_cost columns will
affect the pgr routing functions.  Maybe it will actually forbid the route from ever taking that edge.  Maybe
it will make it crash.  If it is the former, great for us because then we wouldn't have to integrate our
"final check".  If it is the latter, we can just change it to be an acceptably high number and integrate our
"final check".
*/

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
			a.gid AS gid,
			a.name AS name,
			a.cost_s AS cost_s,
			a.reverse_cost_s AS reverse_cost_s
		FROM
			ways AS a
		WHERE 
			NOT ST_Intersects(in_geom, a.the_geom)

		UNION ALL

		SELECT
			a.gid AS gid,
			a.name AS name,
			'INFINITY' AS cost_s,
			'INFINITY' AS reverse_cost_s
		FROM
			ways AS a
		WHERE 
			ST_Intersects(in_geom, a.the_geom)

		ORDER BY
			cost_s
		DESC

	$$

	LANGUAGE SQL;

 /* https://gis.stackexchange.com/questions/262474/pass-geometry-as-input-to-custom-postgis-function/262501
 http://www.postgresonline.com/journal/archives/201-Using-RETURNS-TABLE-vs.-OUT-parameters.html */

SELECT (
	replace_cost(
		ST_GeomFromText(
			'MULTIPOLYGON(((8.40226615336606 49.0079797109504,8.40234579778452 49.0104885101318,8.40676606300897 49.0103823175739,8.40668641859051 49.0078735183924,8.40668641859051 49.0078735183924,8.40226615336606 49.0079797109504)))', 4326
		)
	)
).*





