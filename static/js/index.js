// Google api needs to be included before this

// Load the Youtube API
function onLoadFn() {
    // make gapi.client calls
    gapi.client.setApiKey(YOUTUBE_API_KEY);
    gapi.client.load('youtube','v3').then(function() {
        console.log('youtube api loaded');
    });
    
}
gapi.load("client", onLoadFn);

// Jquery needs to be included before this

// Setup UI
$(function () {
    loadSearchBar();
    $('#search-cmd').click(updateResults);
});

/**
 * Creates the search bar UI
 */
function loadSearchBar () {
    // populate raga list
    var ragalist = [
        'Bhairav',
        'Bhairavi',
        'Bihag',
        'Yaman',
        'Bhupali',
        'Kafi',
        'Kirwani',
        'Vrindavani Sarang',
        'Shuddh Sarang',
        'Jaijaivanti',
        'Jaunpuri',
        'Pilu'
    ];

    ragalist.forEach(function (raga) {
        $('<option>').attr({
            value : raga
        }).text(raga).appendTo('#search-raga');
    });

    // populate instrument list
    var instrumentlist = [
        'Vocal',
        'Sarod',
        'Sitar',
        'Violin',
        'Sarangi',
        'Bansuri',
        'Shehnai',
        'Guitar'
    ];

    instrumentlist.forEach(function (instrument) {
        $('<option>').attr({
            value : instrument
        }).text(instrument).appendTo('#search-instrument');
    });

    // populate decade list
    var decadelist = [
        '1910',
        '1920',
        '1930',
        '1940',
        '1950',
        '1960',
        '1970',
        '1980',
        '1990'
    ];

    decadelist.forEach(function (decade) {
        $('<option>').attr({
            value : decade
        }).text(decade).appendTo('#search-decade');
    });

}

/**
 * Does a search over the database and updates the
 * #search-results div with the results
*/
function updateResults () {
    $('#search-results').empty();
    var searchCriteria = [];
    if ($('#search-raga').val() != '') {
	searchCriteria.push({
	    criterion : 'raga',
	    value :    $('#search-raga').val()
	});
    }
    if ($('#search-instrument').val() != '') {
	searchCriteria.push({
	    criterion : 'instrument',
	    value :    $('#search-instrument').val()
	});
    }
    if ($('#search-artist').val() != '') {
	searchCriteria.push({
	    criterion : 'artist',
	    value :    $('#search-artist').val()
	});
    }
    if ($('#search-decade').val() != '') {
	searchCriteria.push({
	    criterion : 'decade',
	    value :    $('#search-decade').val()
	});
    }

    $.ajax({
	url : '/videos/search',
	data : { criteria : searchCriteria }
    }).done (function (data) {
        var matching_records = [];
	data.forEach(function (datum) {
	    matching_records.push(datum.vid_ytid);
	});
	gapi.client.youtube.videos.list({
	    part : 'snippet',
	    id : matching_records.join(',')
	}).then(addResults);
    });
    
    function addResults (resp) {
	resp.result.items.forEach(function(viditem) {
	    var newDiv = $('<div>').addClass('result-elem');
	    $('<p>').text(viditem.snippet.title).appendTo(newDiv);
	    $('<img>').attr({
		src : viditem.snippet.thumbnails.default.url,
		width : viditem.snippet.thumbnails.default.width,
		height : viditem.snippet.thumbnails.default.height
	    }).appendTo(newDiv);
	    var newPar = $('<p>');
	    $('<a>').attr({
		href : 'https://www.youtube.com/watch?v=' + viditem.id
	    }).text('watch').appendTo(newPar);
	    newPar.appendTo(newDiv);
	    newDiv.appendTo('#search-results');
	});
    }
}
