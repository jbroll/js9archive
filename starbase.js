/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */

"use strict";

function I(x) { return x; }

function starbase_Dashline(dash) {
    var i;

    for ( i = 0; i < dash.length; i++ ) {
	if ( dash[i].match(/^-+$/) === null ) {
	    return 0;
	}
    }

    return i;
}

function Starbase(data, opts) {
    var i, j, skips, done;

    opts = opts || {};

    this.head = {};
    this.type = [];
    this.data = [];

    data = data.replace(/\s+$/,"").split("\n");
    var line = 0;

    if ( opts.skip ) {
	skips = opts.skip.split("");
	for(; line < data.length; line++){
	    if( (skips[0] !== data[line][0])             &&
		(skips[1] !== "\n" || data[line] !== "") ){
		break;
	    }
	}
    }

    // make sure we have a header to process
    if( (data[line] === undefined) || (data[line+1] === undefined) ){
	return;
    }

    this.headline = data[line++].trim().split(/ *\t */);
    if ( opts.units ) {
	this.unitline = data[line++].trim().split(/ *\t */);
    }
    this.dashline = data[line++].trim().split(/ *\t */);

    var dashes = starbase_Dashline(this.dashline);

    // Read lines until the dashline is found
    //
    while ( dashes === 0 || dashes !== this.headline.length ) {

	if ( !opts.units ) {
	    this.headline = this.dashline;
	} else {
	    this.headline = this.unitline;
	    this.unitline = this.dashline;
	}

	this.dashline = data[line++].trim().split(/ *\t */);

	dashes = starbase_Dashline(this.dashline);
    }

    // Create a vector of type converters
    //
    for ( i = 0; i < this.headline.length; i++ ) {
	if ( opts.type && opts.type[this.headline[i]] ) {
	    this.type[i] = opts.type[this.headline[i]];
	} else {
	    if ( opts.type && opts.type.default ) {
		this.type[i] = opts.type.default;
	    } else {
		this.type[i] = I;
	    }
	}
    }

    // Read the data in and convert to type[]
    //
    for ( j = 0; line < data.length; line++, j++ ) {
	// skip means end of data
	if( (skips[0] === data[line][0])             ||
	    (skips[1] === "\n" && data[line] === "") ){
	    break;
	}

	this.data[j] = data[line].split('\t');

	for ( i = 0; i < this.data[j].length; i++ ) {
	    this.data[j][i] = this.type[i](this.data[j][i]);
	}
    }

    for ( i = 0; i < this.headline.length; i++ ) {
	this[this.headline[i]] = i;
    }
}

module.exports = Starbase;

