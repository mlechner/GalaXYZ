/* If you change a function's return type, you have to drop it before redefining it. */
 -- DROP FUNCTION test_func(integer);

/* Begin function declaration, define input as a single integer called 'test_input'. */
CREATE OR REPLACE FUNCTION test_func(
    test_input INTEGER
)
	/* Define return type, we are returning a table with two columns taken from the "ways" table. */
	RETURNS TABLE(
		class_id INTEGER,
		name VARCHAR(255)
	) AS
	/* Define contents of returned values in a standard SQL query. */
	$BODY$
		SELECT
			a.class_id AS class_id,
			a.name AS name
		FROM
			ways AS a
		WHERE 
			a.class_id = test_input AND a.name != ''
		LIMIT
			100;
	$BODY$
	/* Indicate that the function is written in SQL (could also be in C, Python, or others). */
	LANGUAGE SQL;

/* Select the funcion. */
SELECT test_func(112);