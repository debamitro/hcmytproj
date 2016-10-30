var express = require('express');
var app = express();

app.use(express.static('static'));

app.get('/videos/search', function (req, res) {
    doSearch(req.query, res);
});
app.listen(8000);

var file = 'test.db';
var sqlite3 = require('sqlite3').verbose();

function doSearch (query, res) {
    if (query == {}) return {};
    else {
	var db = new sqlite3.Database(file);
	var searchres = [];
	db.serialize(function() {
	    db.each("SELECT vid_ytid from ytvids", function (err, row) {
		searchres.push(row);
	    }, function (err, count) {
		res.json(searchres);
	    });
	});
    }
}
