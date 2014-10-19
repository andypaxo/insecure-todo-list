var express = require('express');
var app = express();
app.set('view engine', 'jade');

var auth = require('./modules/auth');
auth.attachTo(app);

var db = require('./modules/db');

app.get('/', function (req, res) {
	if (req.user) {
		res.render('potions.jade', { username : req.user.name });
	} else {
		res.render('login.jade');
	}
});

var port = process.env.PORT || 4242;
console.log('Listening on port ' + port);
app.listen(port);
