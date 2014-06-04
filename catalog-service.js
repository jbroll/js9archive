/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */

"use strict";


var RemoteService = require("./remote-service");

var Starbase = require("./starbase");
var strtod   = require("./strtod");
var template = require("./template");
var xhr      = require("./xhr");

function CatalogService(params) {
    RemoteService.Register(params.value, this);

    this.type   = "catalog-service";
    this.params = params;

    this.table2cat = function(im, table) {
	var i;
	var shape = this.params.shape;

	var xcol = table[this.params.xcol];
	var ycol = table[this.params.ycol];

	var wcol = 1;
	var hcol = 1;


	var pos_func = function(im, x, y) {
	    var coords = JS9.WCS2Pix(im, x, y);

	    return { x: coords.x, y: coords.y };
	};
	var sizefunc;

	switch ( shape ) {
	 case "box":
	    sizefunc = function(row) {
		    return { width: 5, height: 5 };
		};
	    break;
	 case "circle":
	    sizefunc = function(row) {
		    return { radius: 2.5 };
		};
	    break;
	 case "ellipse":
	    sizefunc = function(row) {
		    return { width: 5, height: 5 };
		};
	    break;
	}

	var regs = [], pos, siz, reg;
	for ( i = 0; i < table.data.length; i++ ) {
	    pos = pos_func(im, table.data[i][xcol]*15, table.data[i][ycol]);
	    siz = sizefunc(im, table.data[i][wcol], table.data[i][hcol]);

	    reg = {   id: i.toString(), shape: shape
			, x: pos.x, y: pos.y
			, width: siz.width, height: siz.height, radius: siz.radius
			, angle: 0
		};

	    regs[i] = reg;
	}

	return regs;
    };

    this.retrieve = function (values, messages) {

	this.params.calc(values);
	values.units = this.params.units;

	var url = template(this.params.url, values);
	
	var catalog = this;

	var reply = xhr({ url: url, title: "Catalog", status: messages, CORS: values.CORS }, function(e) {
	    var table = new Starbase(reply.responseText, { type: { default: strtod }, units: values.units });
	    var im    = JS9.GetImage(values.display);

	    JS9.NewShapeLayer(im, values.name, JS9.Catalogs.opts);
	    JS9.RemoveShapes( im, values.name);

	    var shapes = catalog.table2cat(im, table);

	    JS9.AddShapes(im, values.name, shapes, {color: "yellow"});
	});
    };
}

module.exports = CatalogService;
