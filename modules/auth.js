(function () {
	var session = require('express-session');
	var passport = require('passport');
	var AuthStrategy = require('passport-google-oauth').OAuth2Strategy;
	var db = require('./db');

	var attachTo = function (app) {
		app.use(session({
			secret: 'wonky harpsichord',
			resave: true,
			saveUninitialized: true
		}));
		app.use(passport.initialize());
		app.use(passport.session());

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
	};


	passport.serializeUser(function(user, done) {
		db.storeUser(
		{
			id : user.id,
			name : user.displayName
		}, done);
	});

	passport.deserializeUser(function(id, done) {
		db.fetchUser(id, done);
	});

	passport.use(new AuthStrategy(
		{
		    clientID: process.env.google_client_id,
		    clientSecret: process.env.google_client_secret,
			callbackURL: process.env.google_callback_url
		},
		function(token, tokenSecret, profile, done) {
			done(null, profile);
		}));

	exports.attachTo = attachTo;
})();