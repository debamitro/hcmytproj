// Google api needs to be included before this

function onLoadFn() {
    // make gapi.client calls
    gapi.client.setApiKey(YOUTUBE_API_KEY);
    gapi.client.load('youtube','v3').then(function() {
	console.log('youtube api loaded');
    });
    
}
gapi.load("client", onLoadFn);

function doSearch(pageToken) {
    $('#search-results').empty();
    gapi.client.youtube.search.list({
	'part' : 'snippet',
	'q'    : $('#search-string').val(),
	'type' : 'video',
	'pageToken' : pageToken
    }).then(function(resp) {
	console.log(resp.result);
	updatePrevButton(resp.result.prevPageToken);
	updateNextButton(resp.result.nextPageToken);
	updateResults(resp.result.items);
    }, function(reason) {
	console.log('Error: ' + reason.result.error.message);
    });	
}

function updateResults(result) {
    result.forEach(function (oneresult) {
	// create a result entry
	var newDiv = $('<div/>').addClass('search-result-entry').addClass('container');

	// add the title
	$('<p>').text(oneresult.snippet.title).appendTo(newDiv);

	var rowDiv = $('<div>').addClass('row');
	var imgDiv = $('<div>').addClass('col-sm-4');
	// add the image
	$('<img>').attr({
	    src : oneresult.snippet.thumbnails.default.url,
	    width : oneresult.snippet.thumbnails.default.width,
	    height : oneresult.snippet.thumbnails.default.height
	}).appendTo(imgDiv);
	
	// add the link
	$('<a>').attr({
	    href : "https://www.youtube.com/watch?v=" + oneresult.id.videoId,
	    target : '_blank'
	}).text('watch').appendTo(imgDiv);
	imgDiv.appendTo(rowDiv);
	
	var detailsDiv = $('<div>').addClass('col-sm-8');
	$('<label>').text('Artist').appendTo(detailsDiv);
	$('<input>').attr({
	    id : 'video_' + oneresult.id.videoId + '_artist'
	}).appendTo(detailsDiv);
	$('<label>').text('Instrument').appendTo(detailsDiv);
	$('<input>').attr({
	    id : 'video_' + oneresult.id.videoId + '_instrument'
	}).appendTo(detailsDiv);
	$('<label>').text('Raga').appendTo(detailsDiv);
	$('<input>').attr({
	    id : 'video_' + oneresult.id.videoId + '_raga'
	}).appendTo(detailsDiv);
	$('<button>').text('save').click({
	    id : oneresult.id.videoId,
	    title : oneresult.snippet.title	    
	}
					 ,updateVideoData).appendTo(detailsDiv);
	detailsDiv.appendTo(rowDiv);
	rowDiv.appendTo(newDiv);
	
	// add the result entry
	newDiv.appendTo('#search-results');
    });
}

function updatePrevButton (pageToken) {
    updatePageButton(pageToken, "<<", "#prev-cmd-holder");
}
function updateNextButton (pageToken) {
    updatePageButton(pageToken, ">>", "#next-cmd-holder");
}
function updatePageButton (pageToken, buttontext, buttonid) {
    $(buttonid).empty();
    if (pageToken != null) {
	$('<a>').attr({
	    href : '#'
	}).text(buttontext).click(function () {
	    doSearch(pageToken);
	}).appendTo(buttonid);
    }
}

function updateVideoData (event) {
    var vidArtist = '#video_' + event.data.id + '_artist';
    var vidInstrument = '#video_' + event.data.id + '_instrument';
    var vidRaga = '#video_' + event.data.id + '_raga';
    console.log({
	artist : $(vidArtist).val(),
	instrument : $(vidInstrument).val(),
	raga : $(vidRaga).val()
    });	
}

$(function() {
    // bind enter to search
    $('#search-string').keypress(function (event) {
	if (event.which == 13) {
	    doSearch("");
	}
    });

    // bind click to search
    $('#search-cmd').click(function () {
	doSearch("");	    
    });
});
