var express = require('express');
var session = require('express-session');
var passport = require('passport');

var app = express();
var AuthStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(session({
	secret: 'wonky harpsichord',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	done(null, id);
});

passport.use(new AuthStrategy(
	{
	    clientID: process.env.google_client_id,
	    clientSecret: process.env.google_client_secret,
		callbackURL: process.env.google_callback_url
	},
	function(token, tokenSecret, profile, done) {
		//console.log(arguments);
		done(null, profile);
	}));

app.get('/', function (req, res) {
	res.send(req.user ?
		'Signed in as user ' + req.user :
		'<a href="/auth">Sign In with Google</a>');
});

app.get('/auth', passport.authenticate('google', { scope: 'profile' }));

app.get('/auth/return', passport.authenticate('google',
	{
		successRedirect: '/',
		failureRedirect: '/'
	}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var port = process.env.PORT || 4242;
console.log('Listening on port ' + port);
app.listen(port);