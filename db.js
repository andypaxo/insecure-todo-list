(function () {
	var pg = require('pg');

	var queryAndCrashOnError = function (client, query) {
		client.query(query, function (err) {
			if (err)
				throw err;
		});
	};

	pg.connect(process.env.DATABASE_URL, function(err, client, done) {
		if (err)
			throw err;

		console.log('Connected to postgres successfully');
		client.query("SELECT * FROM information_schema.tables WHERE table_name = 'pb_users'", function (err, result) {
			if (err)
				throw err;

			if (result.rows.length)
				return;

			console.log('First run: creating database')
			queryAndCrashOnError(client, 'CREATE TABLE pb_users ( ' +
				'id SERIAL PRIMARY KEY, ' +
				'google_id INT, ' +
				'name TEXT)');
			queryAndCrashOnError(client, 'CREATE TABLE pb_potions ( ' +
				'id SERIAL PRIMARY KEY, ' +
				'user_id INT REFERENCES pb_users(id), ' +
				'name TEXT, ' +
				'description TEXT)');
		});
	});
})();
