
RemoteService = require("./remote-service")

var subst    = require("./subst")

function ImageService(params) {
    RemoteService.Register(params.value, this);

    this.type   = "image-service"
    this.params = params;

    this.retrieve = function (values, messages) {

	this.params.calc(values)

	var url = subst(this.params.url, values)
	
	xhr({ url: url, title: "Image", status: params.status, type: 'blob', CORS: values.CORS }, function(e, xhr) {
	    blob      = new Blob([xhr.response]);
	    blob.name = values.name

	    Fitsy.fitsopen(blob, function(fits) {
		    var hdu = fits.hdu[0];

		    if ( hdu.databytes === 0 && fits.hdu[1] !== undefined ) {
			hdu = fits.hdu[1];
		    }

		    Fitsy.dataread(fits, hdu, params.deliver);
	    });
	})
    }
}

module.exports = ImageService;
