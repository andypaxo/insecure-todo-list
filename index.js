var express = require('express');
var app = express();
app.set('view engine', 'jade');

var auth = require('./modules/auth');
auth.attachTo(app);

var db = require('./modules/db');

app.get('/', function (req, res) {
	var username = req.user ? req.user.name : 'nobody';
	res.render('index.jade', { username : username });
	// res.send(req.user ?
	// 	'Signed in as ' + req.user.name :
	// 	'<a href="/auth">Sign In with Google</a>');
});

var port = process.env.PORT || 4242;
console.log('Listening on port ' + port);
app.listen(port);
