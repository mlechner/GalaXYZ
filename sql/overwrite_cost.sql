/*
Example function that will return the cost columns from the ways table, but set the cost and reverse_cost
columns to Infinity if the record matches a certain criteria (in this case, if the class_id column is equal
to the function call's input).  I don't know how having Infinity in the cost/reverse_cost columns will
affect the pgr routing functions.  Maybe it will actually forbid the route from ever taking that edge.  Maybe
it will make it crash.  If it is the former, great for us because then we wouldn't have to integrate our
"final check".  If it is the latter, we can just change it to be an acceptably high number and integrate our
"final check".
*/

-- DROP FUNCTION replace_cost(integer);

CREATE OR REPLACE FUNCTION replace_cost(
    test_input INTEGER
)

	RETURNS TABLE(
		class_id INTEGER,
		name VARCHAR(255),
		cost_s DOUBLE PRECISION,
		reverse_cost_s DOUBLE PRECISION
	) AS

	$BODY$
		SELECT
			a.class_id AS class_id,
			a.name AS name,
			a.cost_s AS cost_s,
			a.reverse_cost_s AS reverse_cost_s
		FROM
			ways AS a
		WHERE 
			a.class_id != test_input

		UNION ALL

		SELECT
			a.class_id AS class_id,
			a.name AS name,
			'INFINITY' AS cost_s,
			'INFINITY' AS reverse_cost_s
		FROM
			ways AS a
		WHERE 
			a.class_id = test_input

		ORDER BY
			name

	$BODY$

	LANGUAGE SQL;


SELECT * FROM replace_cost(112);