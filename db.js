(function () {
  var pg = require('pg');

  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    if (err) {
      console.error(err);
    } else {
      console.log('Connected to postgres successfully');
    }
  });

})();
