/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals */

"use strict";

var strtod   = require("./strtod");

var CatalogService = require("./catalog-service");

	var saoCat = new CatalogService({
	      text:  "SAO"
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
		    values.name = values.source + "@" + this.text;
		}

	    , shape: "circle"
	    , xcol:  "ra", ycol: "dec"
	
	});

	var vizCat = new CatalogService({
	      text: "Vizier"
	    , value: "vizCat"		
	    , surveys: [   { value: "II/246",		text: "2MASS"				}
			 , { value: "2MASX",		text: "2MASS Extended Source"		}
			 , { value: "B/DENIS",		text: "DENIS 3rd Release 2005"		}
			 , { value: "GLIMPSE",		text: "Spitzer's GLIMPSE"		}
			 , { value: "GSC2.3",		text: "GSC-II Catalog, Version 2.3.2"	}
			 , { value: "HIP2",		text: "Hipparcos (2007)"		}
			 , { value: "IRAS",		text: "IRAS "				}
			 , { value: "NVSS",		text: "NRAO VLA Sky Survey"		}
			 , { value: "SDSS-DR9",		text: "SDSS Photometric Catalog"	}
			 , { value: "Tycho-2",		text: "Tycho-2"				}
			 , { value: "UCAC4",		text: "UCAC 4th Release"		}
			 , { value: "USNO-A2",		text: "USNO-A2"				}
			 , { value: "USNO-B1",		text: "USNO-B1"				}
			 , { value: "WISE",		text: "WISE"				}
			]
	    , url: "http://vizier.u-strasbg.fr/viz-bin/asu-tsv?-source={s}&-out.add=_RAJ,_DEJ&-c={r}{d}&-c.bm={w}x{h}&-oc.form=s&-out.meta=h"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gzip";
		    }
		    //values.r = (strtod(values.r) * 15).toFixed(4);
		    //values.d =  strtod(values.d);
		    //values.d = (values.d < 0 ? "-" : "+" ) + values.d.toFixed(4);

		    values.name = values.source + "@" + this.text;
		}

	    , shape: "circle"
	    , xcol:  "_RAJ2000", ycol: "_DEJ2000"
	
	});
