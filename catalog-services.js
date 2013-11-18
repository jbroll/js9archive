
	saoCat = new CatalogService({
	      id: "saoCat"		
	    , surveys: [   { name: "tmc",	descrip: "Two Mass Catalog"	}
			   , { name: "gsc2",	descrip: "GST2"			}
			]
	    , url: "http://www.cfa.harvard.edu/catalog/scat?catalog={s}&ra={r}&dec={d}&width={w}&height={h}&system={e}&compress={c}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gzip"
		    }
		    values.w    = values.w*60
		    values.h    = values.h*60
		    values.name = values.name + " " + values.source;
		}

	    , shape: "circle"
	    , xcol:  "ra", ycol: "dec"
	
	})

