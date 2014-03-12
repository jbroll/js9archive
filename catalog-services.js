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

	var vizCat = new CatalogService({
	      text: "Catalogs@Vizier"
	    , value: "vizCat"		
	    , surveys: [   { value: "2MASS-PSC",	text: "2MASS Point Source + 2MASS6x"	}
			 , { value: "2MASX",		text: "2MASS Extended Source"		}
			 , { value: "AKARI",		text: "AKARI IRC (9/18um) and FIS (60-160um)"	}
			 , { value: "B/DENIS",		text: "DENIS 3rd Release 2005"		}
			 , { value: "GLIMPSE",		text: "Spitzer's GLIMPSE"		}
			 , { value: "GSC2.3",		text: "GSC-II Catalog, Version 2.3.2"	}
			 , { value: "HIP2",		text: "Hipparcos (2007)"		}
			 , { value: "IRAS",		text: "IRAS "				}
			 , { value: "NOMAD1",		text: "NOMAD Catalog"			}
			 , { value: "NVSS",		text: "NRAO VLA Sky Survey"		}
			 , { value: "SDSS-DR9",		text: "SDSS Photometric Catalog"	}
			 , { value: "Tycho-2",		text: "Tycho-2"				}
			 , { value: "UCAC4",		text: "UCAC 4th Release"		}
			 , { value: "USNO-A2",		text: "USNO-A2"				}
			 , { value: "USNO-B1",		text: "USNO-B1"				}
			 , { value: "WISE",		text: "WISE"				}
			]
	    , url: "http://vizier.u-strasbg.fr/viz-bin/asu-tsv?-source={s}&-out.add=_RAJ%2C_DEJ&-c={r}{d}&-c.bm={w}x{h}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gzip";
		    }
		    values.name = values.name + " " + values.source;
		}

	    , shape: "circle"
	    , xcol:  "_RAJ2000", ycol: "_DEJ2000"
	    , units: true
	
	});
