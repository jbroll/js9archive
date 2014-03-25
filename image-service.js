/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals xhr, Blob, Fitsy */

"use strict";


var RemoteService = require("./remote-service");
var subst         = require("./subst");
var xhr           = require("./xhr");

function ImageService(params) {
    RemoteService.Register(params.value, this);

    this.type   = "image-service";
    this.params = params;

    this.retrieve = function (values, messages) {

	var deliver = values.deliver;
	var display = values.display;

	params.calc(values);

	var url = subst(params.url, values);

	
	xhr({ url: url, title: "Image", status: params.status, type: 'blob', CORS: values.CORS }, function(e, xhr) {

	    if ( params.handler === undefined ) {
		var blob      = new Blob([xhr.response]);
		blob.name = values.name;

		Fitsy.fitsopen(blob, function(fits) {
			var hdu = fits.hdu[0];

			if ( hdu.databytes === 0 && fits.hdu[1] !== undefined ) {
			    hdu = fits.hdu[1];
			}

			Fitsy.dataread(fits, hdu, deliver, { display: display });
		});
	    } else {
	    	this.handler(e, xhr, params, values);
	    }
	});
    };
}

module.exports = ImageService;
