/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals */

"use strict";

var ImageService = require("./image-service");

	var imageName = function (values) {
	    var plus = "";
	    var name;

	    if ( values.name !== "" ) {
		name = values.name + " " + values.source;
	    } else {
	        name = values.source + " " + values.r + plus + values.d;
	    }

	    return name;
	};

	var saoDSS = new ImageService({
	      text: "DSS1@SAO"
	    , value: "saoDSS"
	    , surveys: [ { value: "DSS1", text: "DSS1" } ]
	    , url: "http://www.cfa.harvard.edu/archive/dss?r={r}&d={d}&w={w}&h={h}&e={e}&c={c}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gzip";
		    }
		    values.name  = imageName(values);
		}
	});

	var stsDSS = new ImageService({
	      text: "DSS@Stsci"
	    , value: "stsDSS"
	    , surveys: [   { value: "poss2ukstu_ir",	text: "StSci DSS2 IR"	}
			 , { value: "poss2ukstu_red",	text: "StSci DSS2 Red"	}
			 , { value: "poss2ukstu_blue",	text: "StSci DSS2 Blue"	}
			 , { value: "poss1_red", 	text: "StSci DSS1 Red"	}
			 , { value: "poss1_blue",	text: "StSci DSS1 Blue"	}
			]
	    , url: "http://stdatu.stsci.edu/cgi-bin/dss_search?r={r}&d={d}&w={w}&h={h}&e={e}&c={c}&v={s}&f=fits"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gz";
		    } else {
			values.c = "none";
		    }
		    values.name  = imageName(values);
		}
	});

	var esoDSS = new ImageService({
	      text: "DSS@ESO"
	    , value: "esoDSS"
	    , surveys: [   { value: "DSS2-infrared",	text: "ESO DSS2 IR"	}
			 , { value: "DSS2-red",    	text: "ESO DSS2 Red"	}
			 , { value: "DSS2-blue",	text: "ESO DSS2 Blue"	}
			 , { value: "DSS1",		text: "ESO DSS1"	}
			]
	    , url: "http://archive.eso.org/dss/dss?ra={r}&dec={d}&equinox=J2000&x={w}&y={h}&mime-type={c}&Sky-Survey={s}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "display/gz-fits";
		    } else {
			values.c = "application/x-fits";
		    }
		    values.name  = imageName(values);
		}
	});

	var ipac2m  = new ImageService({
	      text: "2Mass@IPAC"
	    , value: "ipac2m"
	    , surveys: [   { value: "j", 		text: "IPAC 2Mass J"		}
			 , { value: "h", 		text: "IPAC 2Mass H"		}
			 , { value: "k", 		text: "IPAC 2Mass K"		}
			]
	    , url: "http://irsa.ipac.caltech.edu/cgi-bin/Oasis/2MASSImg/nph-2massimg?objstr={r},{d}&size={radius}&band={s}"
	    , calc: function(values) {
		    values.radius = Math.floor(Math.sqrt(values.w*values.w+values.h*values.h)*60);
		    values.name   = imageName(values);
		}
	});

	var dasch  = new ImageService({
	      text: "DASCH"
	    , value: "dasch"
	    , surveys: [   { value: "plates", 		text: "Plates"		} ]

	    , url: "http://dasch.rc.fas.harvard.edu/showtext.php?listflag=0&dateflag=dateform=j%20&coordflag=&radius=200&daterange=&seriesflag=&plateNumberflag=&classflag=&typeflag=%20-T%20wcsfit%20&pessimisticflag=&bflag=-j&nstars=5000&locstring=12:00:00%2030:00:00%20J2000"

	    , calc: function(values) {
		    values.radius = Math.min(Math.floor(Math.sqrt(values.w*values.w+values.h*values.h)*60), 600);
		    values.name   = imageName(values);
		}
	});

//	var cds = new ImageService({
//	      text: "CDS Aladin Server"
//	    , value: "aladin@cds"
//	    , surveys: [   { value: "j", 		text: "IPAC 2Mass J"		}
//			 , { value: "h", 		text: "IPAC 2Mass H"		}
//			 , { value: "k", 		text: "IPAC 2Mass K"		}
//			]
//	    , url: "http://irsa.ipac.caltech.edu/cgi-bin/Oasis/2MASSImg/nph-2massimg?objstr={r},{d}&size={radius}&band={s}"
//	    , calc: function(values) {
//		    values.radius = Math.floor(Math.sqrt(values.w*values.w+values.h*values.h)*60);
//		    values.name   = imageName(values);
//		}
//	});

//	skyvew  = new ImageService({
//	      id: "skyvew"
//	    , "surveys", [ ]
//	    , url: "http://skys.gsfc.nasa.gov/cgi-bin/images?VCOORD={ra},{dec}&SURVEY={s}&SFACTR={size}&RETURN=FITS"
//	    , calc: function(values) {
//		    values.size = Math.floor((values.w+values.h)/2)
//		    values.name = values.name + " " + values.source;
//		}
//	})

