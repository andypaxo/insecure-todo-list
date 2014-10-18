(function () {
	var pg = require('pg');
	var db_url = process.env.DATABASE_URL;

	var queryAndCrashOnError = function (client, query) {
		client.query(query, function (err) {
			if (err)
				throw err;
		});
	};

	pg.connect(db_url, function(err, client) {
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
				'id TEXT PRIMARY KEY, ' +
				'name TEXT)');
			queryAndCrashOnError(client, 'CREATE TABLE pb_potions ( ' +
				'id SERIAL PRIMARY KEY, ' +
				'user_id TEXT REFERENCES pb_users(id), ' +
				'name TEXT, ' +
				'description TEXT)');
		});
	});

	exports.storeUser = function (user, done) {
		pg.connect(db_url, function(err, client) {
			if (err)
				throw err;

			client.query(
				'INSERT INTO pb_users (id, name) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM pb_users WHERE pb_users.id = $1)',
				[user.id, user.name],
				function (err) {
					done(err, user.id);
				});
		});
	};

	exports.fetchUser = function (id, done) {
		pg.connect(db_url, function(err, client) {
			if (err)
				throw err;

			client.query(
				'SELECT id, name FROM pb_users WHERE pb_users.id = $1',
				[id],
				function (err, result) {
					done(err, result.rows[0]);
				});
		});
	}
})();
