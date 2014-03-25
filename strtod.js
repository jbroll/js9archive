/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals */ 

'use strict';

function Strtod(str) {
    var l = str.trim().split(/[: ]/);
    var x;

    if ( l.length === 3 ) {
	var sign = 1;

	if ( l[0].substr(0, 1) === "-" ) {
	    sign = -1;
	}

	var h = parseFloat(l[0]);
	var m = parseFloat(l[1]);
	var s = parseFloat(l[2]);

	x = sign * (Math.abs(h) + m/60.0 + s/3600.0);
    } else {
	x = parseFloat(str);
    }

    if ( isNaN(x) ) { return str; }

    return x;
}

module.exports = Strtod;
