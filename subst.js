/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */

"use strict";


function subst(text,data) {
	    
    return text.replace(/\{([a-zA-Z0-9_.%]*)\}/g,
	function(m,key){
	    var type, prec, fmt, i;
	    var val = data;
	
	    key = key.split("%");

	    if ( key.length <= 1 ) {
		fmt = "%s";
	    } else {
		fmt = key[1];
	    }

	    key = key[0];
	    key = key.split(".");

	    for ( i = 0; i < key.length; i++ ) {
		if ( val.hasOwnProperty(key[i]) ) {
		    val = val[key[i]];
		} else {
		    return "";
		}
	    }

	    type = fmt.substring(fmt.length-1);
	    prec = fmt.substring(1, fmt.length-1);

	    switch ( type ) {
	     case "s":
		break;
	     case "f":
		val = val.toFixed(prec);
		break;
	     case "d":
		val = val.toFixed(0);
		break;
	    }

	    return val;
	}
    );
}

module.exports = subst;
