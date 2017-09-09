if (process.argv.length < 3) {
    process.exit(1);
}

var file = 'test.db';
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var data = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));

data.forEach(function(elem) {
    doAddition (elem);
});

function doAddition (body) {
    var db = new sqlite3.Database(file);
    db.serialize(function() {
        var stmt = db.prepare("INSERT INTO ytvids(vid_raga, vid_artist, vid_instrument, vid_ytid, vid_decade) VALUES (?, ?, ?, ?, ?)");
        stmt.run(body.raga,
                 body.artist,
                 body.instrument,
                 body.id,
                 body.decade,
                 function (err) {

                 });
        stmt.finalize(); //stmt cannot be used any more
    });
    db.close();
}
