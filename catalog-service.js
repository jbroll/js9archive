/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */

"use strict";


var RemoteService = require("./remote-service");

var Starbase = require("./starbase");
var strtod   = require("./strtod");
var template = require("./template");
var xhr      = require("./xhr");

// use starbase code in js9archive? (otherwise use code in JS9)
var use_internal = false;

function CatalogService(params) {
    RemoteService.Register(params.value, this);

    this.type   = "catalog-service";
    this.params = params;

    this.table2cat = function(im, table) {
	var i, j;
	var shape = this.params.shape;

	var xcol = table[this.params.xcol];
	var ycol = table[this.params.ycol];

	var wcol = 1;
	var hcol = 1;


	var pos_func = function(im, x, y) {
	    var coords = JS9.WCSToPix(x, y, {display: im});

	    if( coords ){
		return { x: coords.x, y: coords.y };
	    }
	    return null;
	};
	var sizefunc;

	switch ( shape ) {
	 case "box":
	    sizefunc = function(row) {
		    return { width: 7, height: 7 };
		};
	    break;
	 case "circle":
	    sizefunc = function(row) {
		    return { radius: 3.5};
		};
	    break;
	 case "ellipse":
	    sizefunc = function(row) {
		    return { width: 7, height: 7 };
		};
	    break;
	}

	var regs = [], pos, siz, reg;
	for ( i = 0, j = 0; i < table.data.length; i++ ) {
	    pos = pos_func(im, table.data[i][xcol]*15, table.data[i][ycol]);
	    if( pos ){
		siz = sizefunc(im, table.data[i][wcol], table.data[i][hcol]);

		reg = {   id: i.toString(), shape: shape
			  , x: pos.x, y: pos.y
			  , width: siz.width, height: siz.height, radius: siz.radius
			  , angle: 0
		          , data: {ra: table.data[i][xcol]*15, dec: table.data[i][ycol]}
		      };

		regs[j++] = reg;
	    }
	}

	return regs;
    };

    this.retrieve = function (values, messages) {

	this.params.calc(values);
	values.units = this.params.units;

	var url = template(this.params.url, values);
	
	var catalog = this;

	var reply = xhr({ url: url, title: "Catalog", status: messages, CORS: values.CORS }, function(e) {
	    var table, im, gopts, opts, shapes;
	    im = JS9.GetImage({display: values.display});
	    if( use_internal ){
		table = new Starbase(reply.responseText, {type: {default: strtod}, units: values.units, skip: "#\n"});
		gopts = $.extend(true, {}, JS9.Catalogs.opts, {tooltip: "$xreg.data.ra $xreg.data.dec"});
		opts = {color: "yellow"};

		if( !table.data.length ){
		    JS9.error("no catalog objects found");
		}

		JS9.NewShapeLayer(values.name, gopts, {display: im});
		JS9.RemoveShapes(values.name, {display: im});

		shapes = catalog.table2cat(im, table);

		JS9.AddShapes(values.name, shapes, opts, {display: im});
	    } else {
		table = reply.responseText;
		gopts = {};
		gopts.units = values.units;
		JS9.LoadCatalog(values.name, table, gopts, {display: im});
	    }
	});
    };
}

module.exports = CatalogService;


