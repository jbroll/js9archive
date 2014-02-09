/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals */

"use strict";

var CatalogService = require("./catalog-service");

	var saoCat = new CatalogService({
	      text: "Catalogs@SAO"
	    , value: "saoCat"		
	    , surveys: [   { value: "tmc",	text: "Two Mass Catalog"	}
			 , { value: "gsc2",	text: "Guide Star Catalog 2"		}
			]
	    , url: "http://www.cfa.harvard.edu/catalog/scat?catalog={s}&ra={r}&dec={d}&width={w}&height={h}&system={e}&compress={c}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gzip";
		    }
		    values.w    = values.w*60;
		    values.h    = values.h*60;
		    values.name = values.name + " " + values.source;
		}

	    , shape: "circle"
	    , xcol:  "ra", ycol: "dec"
	
	});

