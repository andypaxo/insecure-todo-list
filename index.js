var express = require('express');
var app = express();

var auth = require('./auth');
auth.attachTo(app);

var db = require('./db');

app.get('/', function (req, res) {
	res.send(req.user ?
		'Signed in as ' + req.user.name :
		'<a href="/auth">Sign In with Google</a>');
});

var port = process.env.PORT || 4242;
console.log('Listening on port ' + port);
app.listen(port);
