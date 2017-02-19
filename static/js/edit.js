// Google api needs to be included before this

function onLoadFn() {
    // make gapi.client calls
    gapi.client.setApiKey(YOUTUBE_API_KEY);
    gapi.client.load('youtube','v3').then(function() {
	console.log('youtube api loaded');
    });
    
}
gapi.load("client", onLoadFn);

/**
 * Execute the search on youtube using Google's api
 *
 * @param pageToken token string for previous/next page
 * @return void
 *
 * @todo This needs to fetch data from the database when it exists
 */
function doYtSearch(pageToken) {
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

/**
 * Convert the list of responses obtained from a youtube
 * video search into div's with data entry boxes
 *
 * @param result array of objects, each having id and snippet objects
 * @return void
 */
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
	var inputArtist = $('<input>').attr({
	    id : 'video_' + oneresult.id.videoId + '_artist'
	}).appendTo(detailsDiv);
	$('<label>').text('Instrument').appendTo(detailsDiv);
	var inputInstrument = $('<input>').attr({
	    id : 'video_' + oneresult.id.videoId + '_instrument'
	}).appendTo(detailsDiv);
	$('<label>').text('Raga').appendTo(detailsDiv);
	var inputRaga = $('<input>').attr({
	    id : 'video_' + oneresult.id.videoId + '_raga'
	}).appendTo(detailsDiv);
	$('<button>').text('save').click({
	    id : oneresult.id.videoId,
	    title : oneresult.snippet.title,
	    input_artist : inputArtist,
	    input_instrument : inputInstrument,
	    input_raga : inputRaga
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
	    doYtSearch(pageToken);
	}).appendTo(buttonid);
    }
}

/**
 * Receive the data input by the user for a video
 * and send it to the database. This routine is a click handler
 *
 * @param event object sent to click handler
 */
function updateVideoData (event) {
    console.log({
	artist : event.data.input_artist.val(),
	instrument : event.data.input_instrument.val(),
	raga : event.data.input_raga.val()
    });
    $.post('/videos/update',
	  {
	    id : event.data.id,
	    artist : event.data.input_artist.val(),
	    instrument : event.data.input_instrument.val(),
	    raga : event.data.input_raga.val()
	  },
	   function (data) {
	       console.log(data);
	   },
	   "json"
	  );
}

$(function() {
    // bind enter to search
    $('#search-string').keypress(function (event) {
	if (event.which == 13) {
	    doYtSearch("");
	}
    });

    // bind click to search
    $('#search-cmd').click(function () {
	doYtSearch("");	    
    });
});
