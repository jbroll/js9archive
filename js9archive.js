require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"gvncOU":[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9, Option */ 

"use strict";

var xhr = require("./xhr");

var Remote = require("./remote-service");

require("./image-services");
require("./catalog-services");

    function ServiceGo(div, display) {
	var form = $(div).find(".JS9Archive-form")[0];

	if ( form.object.value === "" && ( form.ra.value === "" || form.dec.value === "" ) ) {
	    return;
	}

	var w = parseFloat(form.width.value);
	var h = parseFloat(form.height.value);

	if ( w > 60 ) {
	    form.width.value = "60";
	    w = 60;
	}
	if ( h > 60 ) {
	    form.height.value = "60";
	    h = 60;
	}

	var msrv = $(form).find(".server-menu")[0];
	var msrc = $(form).find(".source-menu")[0];

	var service = msrv.options[msrv.selectedIndex].value;
	var source  = msrc.options[msrc.selectedIndex].value;
	var server  = Remote.Services[service];

	var text    = msrc.options[msrc.selectedIndex].innerHTML;
	
	if ( form.object.value !== "" ) {
	    var simbad = encodeURI('http://hopper.si.edu/http/simbad?' + form.object.value);

	    xhr({ url: simbad, title: "Name", status: "#status" }, function(e, xhr) {
		var coords = xhr.responseText.trim().split(" ");

		form.ra.value  = coords[0];
		form.dec.value = coords[1];

		server.retrieve({ name: form.object.value, e: "J2000", h: h.toString(), w: w.toString()
				, r: form.ra.value, d: form.dec.value
				, c: form.gzip.checked
				, s: source
				, source: text

				, CORS: form.CORS.checked
				, display: display
			      }
			    , $("#status"));
	    });

	    return;
	}

	server.retrieve({ name: form.object.value, e: "J2000", h: h.toString(), w: w.toString()
			, r: form.ra.value, d: form.dec.value
			, c: form.gzip.checked
			, s: source
			, source : text

			, CORS: form.CORS.checked
			, display: display
		      }
		    , $("#status"));
    }

    function GetRADec(div, display) {
	var im = JS9.GetImage(display);
	var form = $(div).find(".JS9Archive-form")[0];

	var coords = JS9.pix2wcs(im.wcs, im.raw.header.NAXIS1/2, im.raw.header.NAXIS2/2).split(/ +/);

	var c0 = JS9.Pix2WCS(im, im.raw.header.NAXIS1/2, im.raw.header.NAXIS2/2);

	form.object.value = "";

	form.ra.value = coords[0];
	form.dec.value = coords[1];

	var c1 = JS9.Pix2WCS(im, 0,                    im.raw.header.NAXIS2/2);
	var c2 = JS9.Pix2WCS(im, im.raw.header.NAXIS1, im.raw.header.NAXIS2/2);

	form.width.value = Math.floor(Math.abs((c1[0]-c2[0])*60)*Math.cos(c0[1]/57.2958)*10)/10;

	c1 = JS9.Pix2WCS(im, im.raw.header.NAXIS1/2,                    0);
	c2 = JS9.Pix2WCS(im, im.raw.header.NAXIS1/2, im.raw.header.NAXIS2);

	form.height.value = Math.floor(Math.abs((c1[1]-c2[1])*60)*10)/10;
    }

    function populateOptions(s) {
	var select = s[0];
	var dataArray = $(s).data("menu");
	var submenu   = $(s).data("submenu");

	select.options.length = 0;
	$.each(dataArray, function(index, data) {
	    select.options[select.options.length] = new Option(data.text, data.value);

	});

	if ( submenu !== undefined ) {
	    $(submenu).data("menu", dataArray[select.selectedIndex].subdata);
	    populateOptions(submenu);

	    s.change(function() {
		$(submenu).data("menu", dataArray[select.selectedIndex].subdata);
		populateOptions(submenu);
	    });
	}
    }

    function NewArchiveBox() {

	var div = this.div;

	div.innerHTML = '<form class="JS9Archive-form">\
	    <select class="service-menu"></select>\
	    <select class="server-menu"></select>\
	    <select class="source-menu"></select>\
	    <span style="float: right;"><input type=button value="Retrieve Data" class="service-go" style="font-weight: bold;"></span>	\
	    <p>\
														\
	    <table width="98%">\
	    <tr><td> Object: </td> <td> <input type=text name=object size=10> </td>\
		<td></td>\
		<td></td>\
		<td>&nbsp;&nbsp;</td>\
		<td> <input type=checkbox name=gzip> Use Compression</td>\
	    </tr>\
	    <tr><td> RA:  	</td><td>	<input type=text name=ra	size=10> </td>\
		<td> Dec: 	</td><td>	<input type=text name=dec	size=10> </td>\
		<td> <input type=button value="Set RA/Dec" class="get-ra-dec"> </td>\
		<td> <input type=checkbox name=CORS checked> Use CORS Proxy</td>\
	    <tr><td> Width: </td><td>	<input type=text name=width	size=10 value=15> </td>\
		<td> Height: </td><td>	<input type=text name=height	size=10 value=15> </td>\
	    </tr>\
	    </tr>\
	    <tr><td colspan=6><span id=status></span></td></tr>\
	    </form>';

	var mtyp = $(div).find(".service-menu");
	var msrv = $(div).find(".server-menu");
	var msrc = $(div).find(".source-menu");

	$(mtyp).data("submenu", msrv);
	$(msrv).data("submenu", msrc);

	var display = this.display;

	$(div).find(".service-go").click(function () { ServiceGo(div, display); });
	$(div).find(".get-ra-dec").click(function () { GetRADec (div, display); });
	
	var imgmenu = [];
	$.each(Remote.Services, function(i, service) {
	    if ( service.type !== "image-service" ) { return; }

	    imgmenu.push({ text: service.params.text, value: service.params.value, subdata: service.params.surveys });
	});

	var catmenu = [];
	$.each(Remote.Services, function(i, service) {
	    if ( service.type !== "catalog-service" ) { return; }

	    catmenu.push({ text: service.params.text, value: service.params.value, subdata: service.params.surveys });
	});

	$(mtyp).data("menu", [ { text: "Image Servers",   value: "imgserv", subdata: imgmenu }
			     , { text: "Catalog Servers", value: "catserv", subdata: catmenu }]);

	populateOptions(mtyp);
    }

module.exports = NewArchiveBox;

},{"./catalog-services":4,"./image-services":6,"./remote-service":7,"./xhr":"o9ulOK"}],"./archive":[function(require,module,exports){
module.exports=require('gvncOU');
},{}],3:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */

"use strict";


var RemoteService = require("./remote-service");

var Starbase = require("./starbase");
var Strtod   = require("./strtod");
var subst    = require("./subst");
var xhr      = require("./xhr");

function CatalogService(params) {
    RemoteService.Register(params.value, this);

    this.type   = "catalog-service";
    this.params = params;

    this.table2cat = function(im, table) {
	var i;
	var shape = this.params.shape;

	var xcol = table[this.params.xcol];
	var ycol = table[this.params.ycol];

	var wcol = 1;
	var hcol = 1;


	var pos_func = function(im, x, y) {
	    var coords = JS9.WCS2Pix(im, x, y);

	    return { x: coords[0], y: coords[1] };
	};
	var sizefunc;

	switch ( shape ) {
	 case "box":
	    sizefunc = function(row) {
		    return { width: 5, height: 5 };
		};
	    break;
	 case "circle":
	    sizefunc = function(row) {
		    return { radius: 2.5 };
		};
	    break;
	 case "ellipse":
	    sizefunc = function(row) {
		    return { width: 5, height: 5 };
		};
	    break;
	}

	var regs = [], pos, siz, reg;
	for ( i = 0; i < table.data.length; i++ ) {
	    pos = pos_func(im, table.data[i][xcol]*15, table.data[i][ycol]);
	    siz = sizefunc(im, table.data[i][wcol], table.data[i][hcol]);

	    reg = {   id: i.toString(), shape: shape
			, x: pos.x, y: pos.y
			, width: siz.width, height: siz.height, radius: siz.radius
			, angle: 0
		};

	    regs[i] = reg;
	}

	return regs;
    };

    this.retrieve = function (values, messages) {

	this.params.calc(values);

	var url = subst(this.params.url, values);
	
	var catalog = this;

	var reply = xhr({ url: url, title: "Catalog", status: "#status", CORS: values.CORS }, function(e) {
	    var table = new Starbase(reply.responseText, { type: { default: Strtod } });
	    var im    = JS9.GetImage(values.display);

	    $("#status").text("Found " + table.data.length.toString() + " rows");

	    JS9.Catalog(im, catalog.table2cat(im, table), { name: catalog.name });
	});
    };
}

module.exports = CatalogService;

},{"./remote-service":7,"./starbase":8,"./strtod":9,"./subst":10,"./xhr":"o9ulOK"}],4:[function(require,module,exports){
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


},{"./catalog-service":3}],5:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals xhr, Blob, Fitsy */

"use strict";


var RemoteService = require("./remote-service");
var subst         = require("./subst");
var xhr           = require("./xhr");

function ImageService(params) {
    RemoteService.Register(params.value, this);

    this.type   = "image-service";
    this.params = params;

    this.retrieve = function (values, messages) {

	this.params.calc(values);

	var url = subst(this.params.url, values);
	var deliver = values.deliver;
	var display = values.display;
	
	xhr({ url: url, title: "Image", status: params.status, type: 'blob', CORS: values.CORS }, function(e, xhr) {
	    var blob      = new Blob([xhr.response]);
	    blob.name = values.name;

	    Fitsy.fitsopen(blob, function(fits) {
		    var hdu = fits.hdu[0];

		    if ( hdu.databytes === 0 && fits.hdu[1] !== undefined ) {
			hdu = fits.hdu[1];
		    }

		    Fitsy.dataread(fits, hdu, deliver, { display: display });
	    });
	});
    };
}

module.exports = ImageService;

},{"./remote-service":7,"./subst":10,"./xhr":"o9ulOK"}],6:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals */

"use strict";

var ImageService = require("./image-service");

	var saoDSS = new ImageService({
	      text: "DSS1@SAO"
	    , value: "saoDSS"
	    , surveys: [ { value: "DSS1", text: "DSS1" } ]
	    , url: "http://www.cfa.harvard.edu/archive/dss?r={r}&d={d}&w={w}&h={h}&e={e}&c={c}"
	    , calc: function(values) {
		    if ( values.c ) {
			values.c = "gzip";
		    }
		    values.name = values.name + " " + values.source;
		}
	});

	var stsDSS = new ImageService({
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
			values.c = "gz";
		    } else {
			values.c = "none";
		    }
		    values.name = values.name + " " + values.source;
		}
	});

	var esoDSS = new ImageService({
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
			values.c = "display/gz-fits";
		    } else {
			values.c = "application/x-fits";
		    }
		    values.name = values.name + " " + values.source;
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
		    values.name = values.name + " " + values.source;
		}
	});

	var cds = new ImageService({
	      text: "CDS Aladin Server"
	    , value: "aladin@cds"
	    , surveys: [   { value: "j", 		text: "IPAC 2Mass J"		}
			 , { value: "h", 		text: "IPAC 2Mass H"		}
			 , { value: "k", 		text: "IPAC 2Mass K"		}
			]
	    , url: "http://irsa.ipac.caltech.edu/cgi-bin/Oasis/2MASSImg/nph-2massimg?objstr={r},{d}&size={radius}&band={s}"
	    , calc: function(values) {
		    values.radius = Math.floor(Math.sqrt(values.w*values.w+values.h*values.h)*60);
		    values.name = values.name + " " + values.source;
		}
	});

//	skyvew  = new ImageService({
//	      id: "skyvew"
//	    , "surveys", [ ]
//	    , url: "http://skys.gsfc.nasa.gov/cgi-bin/images?VCOORD={ra},{dec}&SURVEY={s}&SFACTR={size}&RETURN=FITS"
//	    , calc: function(values) {
//		    values.size = Math.floor((values.w+values.h)/2)
//		    values.name = values.name + " " + values.source;
//		}
//	})


},{"./image-service":5}],7:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */

"use strict";


exports.Services = {};

exports.Register = function(name, obj) {
	exports.Services[name] = obj;
};

},{}],8:[function(require,module,exports){
/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */

"use strict";


function I(x) { return x; }

function Starbase_Dashline(dash) {
    var i;

    for ( i = 0; i < dash.length; i++ ) {
	if ( dash[i].match(/^-+$/) == null ) {
	    return 0;
	}
    }

    return i;
}

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

    var dashes = Starbase_Dashline(this.dashline);

    // Read lines until the dashline is found
    //
    while ( dashes === 0 || dashes !== this.headline.length ) {

	this.headline = this.dashline;
	this.dashline = data[line++].trim().split(/ *\t */);

	dashes = Starbase_Dashline(this.dashline);
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


},{}],9:[function(require,module,exports){

function Strtod(str) {
    var l = str.trim().split(":")
    var x;

    if ( l.length == 3 ) {
	var sign = 1;

	if ( l[0].substr(0, 1) === "-" ) {
	    sign = -1;
	}

	var h = parseFloat(l[0])
	var m = parseFloat(l[1])
	var s = parseFloat(l[2])

	x = sign * (Math.abs(h) + m/60.0 + s/3600.0)
    } else {
	x = parseFloat(str);
    }

    if ( isNaN(x) ) {
	return str;
    } else {
	return x;
    }
}

module.exports = Strtod;

},{}],10:[function(require,module,exports){
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

},{}],"./xhr":[function(require,module,exports){
module.exports=require('o9ulOK');
},{}],"o9ulOK":[function(require,module,exports){

 	function xhr(params, func) {
	    var title = ""

	    if ( params.CORS ) {
		params.url = params.url.replace(/\?/g, "@")
		params.url = params.url.replace(/&/g, "!")
		params.url = params.url.replace(/\+/g, "")

		params.url = encodeURI(params.url)

		params.url="http://hopper.si.edu/http/CORS-proxy?Q=" + params.url
	    }

	    var xhr = new XMLHttpRequest();

	    xhr.open('GET', params.url, true);

	    if ( params.title ) {
		title = params.title
	    }
	    if ( params.type ) {
		xhr.responseType = params.type;
	    }

	    if ( params.status ) {
		xhr.addEventListener("progress"	, function(e) { $(params.status).text(title + " progress " + e.loaded.toString()) });
		xhr.addEventListener("error"	, function(e) { $(params.status).text(title + " service error"); });
		xhr.addEventListener("abort"	, function(e) { $(params.status).text(title + " service aborted"); });
	    }
	    xhr.onload = function(e) {
		if ( this.readyState === 4 ) {
		    if ( this.status === 200 || this.status === 0 ) {
			if ( params.status != undefined ) { $(params.status).text(""); }
			func(e, this)
		    }
		}
	    }
	    xhr.send();

	    return xhr;
	}

module.exports = xhr;


},{}]},{},[])
;/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals JS9 */ 

"use strict";


JS9.RegisterPlugin("DataSources", "ArchivesCatalogs", require("./archive"), {
	menu: "analysis",
	menuItem: "Archives & Catalogs",
	winDims: [600, 150]
});


