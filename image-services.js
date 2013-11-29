ImageService = require("./image-service");

	saoDSS = new ImageService({
	      text: "DSS1@SAO"
	    , value: "saoDSS"
	    , surveys: [ { value: "DSS1", text: "DSS1" } ]
	    , url: "http://www.cfa.harvard.edu/archive/dss?r={r}&d={d}&w={w}&h={h}&e={e}&c={c}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gzip"
		    }
		    values.name = values.name + " " + values.source;
		}
	})

	stsDSS = new ImageService({
	      text: "DSS@Stsci"
	    , value: "stsDSS"
	    , surveys: [   { value: "poss2ukstu_ir",	text: "StSci DSS2 Infrared"	}
			 , { value: "poss2ukstu_red",	text: "StSci DSS2 Red"	}
			 , { value: "poss2ukstu_blue",	text: "StSci DSS2 Blue"	}
			 , { value: "poss1_red", 	text: "StSci DSS1 Red"	}
			 , { value: "poss1_blue",	text: "StSci DSS1 Blue"	}
			]
	    , url: "http://stdatu.stsci.edu/cgi-bin/dss_search?r={r}&d={d}&w={w}&h={h}&e={e}&c={c}&v={s}&f=fits"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gz"
		    } else {
			values.c = "none"
		    }
		    values.name = values.name + " " + values.source;
		}
	})

	esoDSS = new ImageService({
	      text: "DSS@ESO"
	    , value: "esoDSS"
	    , surveys: [   { value: "DSS2-infrared",	text: "ESO DSS2 Infrared"	}
			 , { value: "DSS2-red",    	text: "ESO DSS2 Red"		}
			 , { value: "DSS2-blue",	text: "ESO DSS2 Blue"	}
			 , { value: "DSS1",		text: "ESO DSS1"		}
			]
	    , url: "http://archive.eso.org/dss/dss?ra={r}&dec={d}&equinox=J2000&x={w}&y={h}&mime-type={c}&Sky-Survey={s}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "display/gz-fits"
		    } else {
			values.c = "application/x-fits"
		    }
		    values.name = values.name + " " + values.source;
		}
	})

	ipac2m  = new ImageService({
	      text: "2Mass@IPAC"
	    , value: "ipac2m"
	    , surveys: [   { value: "j", 		text: "IPAC 2Mass J"		}
			 , { value: "h", 		text: "IPAC 2Mass H"		}
			 , { value: "k", 		text: "IPAC 2Mass K"		}
			]
	    , url: "http://irsa.ipac.caltech.edu/cgi-bin/Oasis/2MASSImg/nph-2massimg?objstr={r},{d}&size={radius}&band={s}"
	    , calc: function(values) {
		    values.radius = Math.floor(Math.sqrt(values.w*values.w+values.h*values.h)*60)
		    values.name = values.name + " " + values.source;
		}
	})

	cds = new ImageService({
	      text: "CDS Aladin Server"
	    , value: "aladin@cds"
	    , surveys: [   { value: "j", 		text: "IPAC 2Mass J"		}
			 , { value: "h", 		text: "IPAC 2Mass H"		}
			 , { value: "k", 		text: "IPAC 2Mass K"		}
			]
	    , url: "http://irsa.ipac.caltech.edu/cgi-bin/Oasis/2MASSImg/nph-2massimg?objstr={r},{d}&size={radius}&band={s}"
	    , calc: function(values) {
		    values.radius = Math.floor(Math.sqrt(values.w*values.w+values.h*values.h)*60)
		    values.name = values.name + " " + values.source;
		}
	})

//	skyvew  = new ImageService({
//	      id: "skyvew"
//	    , "surveys", [ ]
//	    , url: "http://skys.gsfc.nasa.gov/cgi-bin/images?VCOORD={ra},{dec}&SURVEY={s}&SFACTR={size}&RETURN=FITS"
//	    , calc: function(values) {
//		    values.size = Math.floor((values.w+values.h)/2)
//		    values.name = values.name + " " + values.source;
//		}
//	})

