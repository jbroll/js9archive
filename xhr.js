/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals XMLHttpRequest */ 

'use strict';

    function xhr(params, func) {
	var status = params.status;
	var title = "";

	if ( params.CORS ) {
	    params.url = params.url.replace(/\?/g, "@");
	    params.url = params.url.replace(/&/g, "!");
	    //params.url = params.url.replace(/\+/g, "");

	    params.url = encodeURI(params.url);

	    params.url="http://hopper.si.edu/http/CORS-proxy?Q=" + params.url;
	}

	var _xhr = new XMLHttpRequest();

	_xhr.open('GET', params.url, true);

	if ( params.title ) {
	    title = params.title;
	}
	if ( params.type ) {
	    _xhr.responseType = params.type;
	}

	if ( status !== undefined ) {
	    
	    _xhr.addEventListener("progress"	, function(e) { status(title + " progress " + e.loaded.toString());	});
	    _xhr.addEventListener("error"	, function(e) { status(title + " service error"); 			});
	    _xhr.addEventListener("abort"	, function(e) { status(title + " service aborted"); 			});
	}
	_xhr.onload = function(e) {
	    if ( this.readyState === 4 ) {
		if ( this.status === 200 || this.status === 0 ) {
		    if ( status !== undefined ) { status(""); }

		    func(e, this);
		}
	    }
	};
	_xhr.send();

	return _xhr;
    }

module.exports = xhr;

