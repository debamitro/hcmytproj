/* eslint-env node */

var express = require('express');
var app = express();

app.use(express.static('static'));

app.get('/videos/search', function (req, res) {
    doSearch(req.query, res);
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true}));

var logger = require('morgan');

app.use(logger('combined'));
app.post('/videos/update', function (req, res) {
    console.log(req.body);
    doUpdate(req.body, res);
});

app.listen(8000);

var file = 'test.db';
var sqlite3 = require('sqlite3').verbose();

/**
 * Execute video search and send out response
 *
 * @param query json object sent in request
 * @param res http response object
 *
 * @todo This needs to process a query having any or all fields
*/
function doSearch (query, res) {
    if (query == {}) return {};
    else {
        console.log(query);
        var criteriaStrings = [];
        query.criteria.forEach(function(elem) {
            if (elem.criterion == 'artist') {
                criteriaStrings.push("vid_artist=\"" + elem.value + "\"");
            }
            else if (elem.criterion == 'raga') {
                criteriaStrings.push("vid_raga=\"" + elem.value + "\"");
            }
            else if (elem.criterion == 'instrument') {
                criteriaStrings.push("vid_instrument=\"" + elem.value + "\"");
            }
            else if (elem.criterion == 'decade') {
                criteriaStrings.push("vid_decade=\"" + elem.value + "\"");
            }
        });
        var queryString = "SELECT vid_ytid from ytvids where " + criteriaStrings.join(" and ");
        var db = new sqlite3.Database(file);
        db.serialize(function() {
            db.all(queryString, function (err, rows) {
                res.json(rows);
            });
        });

        db.close();
    }
}

/**
 * Execute video details updation and send out response
 *
 * @param body json object sent in request
 * @param res http response object
*/
function doUpdate (body, res) {
    var db = new sqlite3.Database(file);
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO ytvids(vid_raga, vid_artist, vid_instrument, vid_ytid, vid_decade) VALUES (?, ?, ?, ?, ?)");
        stmt.run(body.raga,
                 body.artist,
                 body.instrument,
                 body.id,
                 1990,
                 function (err) {
                     res.json({ status: (err == null) ? "success" : "failure" });
                 });
        stmt.finalize(); //stmt cannot be used any more
    });
    db.close();
}
