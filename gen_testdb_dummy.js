var fs = require('fs');
var file = 'test.db';
var exists = fs.existsSync(file);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

var the_database = [
    {
	'raga' : 'Bhairav',
	'instrument' : 'Vocal',
	'artist' : 'Rashid Khan',
	'id' : 'b0dm0th5bnY'
    },
    {
	'raga' : 'Bhairav',
	'instrument' : 'Vocal',
	'artist' : 'Bhimsen Joshi',
	'id' : 'NMHoLg5PxRM'
    },
    {
	'raga' : 'Bhairav',
	'instrument' : 'Sitar',
	'artist' : 'Nikhil Banerjee',
	'id' : 'r4KI5X-HFUU'
    },
    {
	'raga' : 'Bhairavi',
	'instrument' : 'Sarod',
	'artist' : 'Ali Akbar Khan',
	'id' : 'AvA-vog4srU'
    }
];

db.serialize(function() {
    if (!exists) {
	db.run("CREATE TABLE ytvids (vid_id INTEGER PRIMARY KEY AUTOINCREMENT, vid_raga TEXT, vid_artist TEXT, vid_instrument TEXT, vid_ytid TEXT, vid_decade NUM)");
	var stmt = db.prepare("INSERT INTO ytvids(vid_raga, vid_artist, vid_instrument, vid_ytid, vid_decade) VALUES (?, ?, ?, ?, ?)");
	the_database.forEach(function (elem) {
	    stmt.run(elem.raga,
		 elem.artist,
		 elem.instrument,
		 elem.id,
		 1990);
	});
	stmt.finalize();
    }

    db.each("SELECT * from ytvids", function (err, row) {
	console.log(row);
    });

});
