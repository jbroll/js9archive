/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */

"use strict";


function I(x) { return x; }

function Starbase(data, options) {
    var i, j;

    this.head = {};
    this.type = [];
    this.data = [];

    data = data.substring(0, data.length-1).split("\n");
    var line = 0;

    if ( options && options.skip ) {
	while ( data[line][0] === options.skip ) { line++; }
    }

    this.headline = data[line++].trim().split(/ *\t */);
    this.dashline = data[line++].trim().split(/ *\t */);

    var dashes = this.dashline.length * (this.dashline === '' ? 0 : 1);

    // Read lines until the dashline is found
    //
    while ( dashes === 0 || dashes !== this.headline.length ) {

	this.headline = this.dashline;
	this.dashline = data[line++].trim().split(/ *\t */);

	dashes = this.dashline.length * (this.dashline === '' ? 0 : 1);
    }

    // Create a vector of type converters
    //
    for ( i = 0; i < this.headline.length; i++ ) {
	if ( options && options.type && options.type[this.headline[i]] ) {
	    this.type[i] = options.type[this.headline[i]];
	} else {
	    if ( options && options.type && options.type.default ) {
		this.type[i] = options.type.default;
	    } else {
		this.type[i] = I;
	    }
	}
    }

    // Read the data in and convert to type[]
    //
    for ( j = 0; line < data.length; line++, j++ ) {
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

