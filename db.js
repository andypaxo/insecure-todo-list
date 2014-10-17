(function () {
  var pg = require('pg');

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
    	throw err;

	console.log('Connected to postgres successfully');
	client.query('SELECT * FROM pg_catalog.tables WHERE tablename = pb_users', function (err, result) {
		if (err)
			throw err;

		if (result.rows.length)
			return;

		// TODO : Create database
		client.query();
	});
  });

})();
