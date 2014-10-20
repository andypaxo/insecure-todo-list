var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'jade');

var auth = require('./modules/auth');
auth.attachTo(app);

var db = require('./modules/db');

app.get('/', function (req, res) {
	if (req.user) {
		db.getPotions(req.user.id, function (potions) {
			res.render('potions.jade', {
				username : req.user.name,
				potions : potions
			});
		});
	} else {
		res.render('login.jade');
	}
});

app.post('/create', function (req, res) {
	if (req.param('name') && req.user)
	{
		db.createPotion({
				name: req.param('name'),
				user_id: req.user.id
			}, function () {
				res.redirect('/');
			});
	} else {
		res.redirect('/');
	}
});

app.get('/editpotion/:id', function (req, res) {
	var potionId = req.params['id'];
	if (potionId) {
		db.fetchPotion(potionId, function (potion) {
			res.render('editpotion.jade', potion);
		});
	}
});

var port = process.env.PORT || 4242;
console.log('Listening on port ' + port);
app.listen(port);
