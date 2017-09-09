'use strict';

var google = require('googleapis');
var ytclient = google.youtube('v3');
var secrets = require('./secrets.json');
//console.log(ytclient);


function doYtSearch(search_str) {
    ytclient.search.list({
        key : secrets.YOUTUBE_API_KEY,
        part : 'snippet',
        q : search_str,
        type : 'video',
        maxResults : 20
    }, function (err,data) {
        if (err) {
            console.error('Error : ' + err);
        }
        if (data) {
            //console.log(data.items);
            printYtSearchResults(data.items);
        }
    });
}

doYtSearch('raga bhairav');

function printYtSearchResults (results) {
    results.forEach (function (oneresult) {
        console.log('Id: ' + oneresult.id.videoId);
        console.log('Title: ' + oneresult.snippet.title);
        console.log('Description: ' + oneresult.snippet.description);
    });
}
