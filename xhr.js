
 	function xhr(params, func) {
	    var title = ""

	    if ( params.CORS ) {
		params.url = params.url.replace(/\?/g, "@")
		params.url = params.url.replace(/&/g, "!")
		params.url = params.url.replace(/\+/g, "")

		params.url = encodeURI(params.url)

		params.url="http://hopper.si.edu/http/CORS-proxy?Q=" + params.url
	    }

	    var xhr = new XMLHttpRequest();

	    xhr.open('GET', params.url, true);

	    if ( params.title ) {
		title = params.title
	    }
	    if ( params.type ) {
		xhr.responseType = params.type;
	    }

	    if ( params.status ) {
		xhr.addEventListener("progress"	, function(e) { $(params.status).text(title + " progress " + e.loaded.toString()) });
		xhr.addEventListener("error"	, function(e) { $(params.status).text(title + " service error"); });
		xhr.addEventListener("abort"	, function(e) { $(params.status).text(title + " service aborted"); });
	    }
	    xhr.onload = function(e) {
		if ( this.readyState === 4 ) {
		    if ( this.status === 200 || this.status === 0 ) {
			if ( params.status != undefined ) { $(params.status).text(""); }
			func(e, this)
		    }
		}
	    }
	    xhr.send();

	    return xhr;
	}

module.exports = xhr;

