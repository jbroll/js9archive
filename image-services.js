
	saoDSS = new ImageService({
	      id: "saoDSS"
	    , surveys: [ { name: "DSS1", descrip: "" } ]
	    , url: "http://www.cfa.harvard.edu/archive/dss?r={r}&d={d}&w={w}&h={h}&e={e}&c={c}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gzip"
		    }
		    values.name = values.name + " " + values.source;
		}
	})

	stsDSS = new ImageService({
	      id: "stsDSS"
	    , surveys: [   { name: "poss2ukstu_ir",	descrip: "StSci DSS2 Infrared"	}
			 , { name: "poss2ukstu_red",	descrip: "StSci DSS2 Red"	}
			 , { name: "poss2ukstu_blue",	descrip: "StSci DSS2 Blue"	}
			 , { name: "poss1_red", 	descrip: "StSci DSS1 Red"	}
			 , { name: "poss1_blue",	descrip: "StSci DSS1 Blue"	}
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
	      id: "esoDSS"
	    , surveys: [   { name: "DSS2-infrared",	descrip: "ESO DSS2 Infrared"	}
			 , { name: "DSS2-red",    	descrip: "ESO DSS2 Red"		}
			 , { name: "DSS2-blue", 	descrip: "ESO DSS2 Blue"	}
			 , { name: "DSS1",		descrip: "ESO DSS1"		}
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
	      id: "ipac2m"
	    , surveys: [   { name: "j", 		descrip: "IPAC 2Mass J"		}
			 , { name: "h", 		descrip: "IPAC 2Mass H"		}
			 , { name: "k", 		descrip: "IPAC 2Mass K"		}
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

