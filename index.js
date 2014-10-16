var express = require('express');
var app = express();

app.get('/', function (req, res) {
	res.send('todo list');
});

var port = process.env.PORT || 4242;
console.log('Listening on port ' + port);
app.listen(port);