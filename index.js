var express = require('express');
var app = express();

var passport = require('passport');
var AuthStrategy = require('passport-google').Strategy;

passport.use(new AuthStrategy(
	{
		returnURL: 'http://hidden-beyond-5840.herokuapp.com/auth/return',
		realm : 'http://hidden-beyond-5840.herokuapp.com/'
	},
	function(identifier, profile, done) {
		console.log(arguments);
		done();
	}));

console.log(process.env);

app.get('/', function (req, res) {
	res.send('<a href="/auth">Sign In with Google</a>');
});

app.get('/auth', passport.authenticate('google'));

app.get('/auth/return', passport.authenticate('google',
	{
		successRedirect: '/',
		failureRedirect: '/'
	}));

var port = process.env.PORT || 4242;
console.log('Listening on port ' + port);
app.listen(port);