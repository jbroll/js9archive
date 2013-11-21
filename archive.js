
	Services = {}

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

	function ServiceGo() {
	    var form = $(".JS9Archive-form")[0]

	    if ( form.object.value === "" && ( form.ra.value === "" || form.dec.value === "" ) ) {
		return;
	    }

	    w = parseFloat(form.width.value)
	    h = parseFloat(form.height.value)

	    if ( w > 60 ) {
		form.width.value = "60";
		w = 60;
	    }
	    if ( h > 60 ) {
		form.height.value = "60";
		h = 60;
	    }

	    var msrv = $(form).find(".server-menu")[0]
	    var msrc = $(form).find(".source-menu")[0]

	    var service = msrv.options[msrv.selectedIndex].value
	    var source  = msrc.options[msrc.selectedIndex].value
	    var server  = Services[service]

	    var text    = msrc.options[msrc.selectedIndex].innerHTML
	    
	    if ( form.object.value !== "" ) {
		simbad=encodeURI('http://hopper.si.edu/http/simbad?' + form.object.value)

		xhr({ url: simbad, title: "Name", status: "#status" }, function(e, xhr) {
		    var coords = xhr.responseText.trim().split(" ");

		    form.ra.value  = coords[0]
		    form.dec.value = coords[1]

		    // $("#status").text("");

		    server.retrieve({ name: form.object.value, e: "J2000", h: h.toString(), w: w.toString()
				    , r: form.ra.value, d: form.dec.value
				    , c: form.gzip.checked
				    , s: source
				    , source: text

				    , CORS: form.CORS.checked
				  }
				, $("#status"));
		})

		return
	    }

	    server.retrieve({ name: form.object.value, e: "J2000", h: h.toString(), w: w.toString()
			    , r: form.ra.value, d: form.dec.value
			    , c: form.gzip.checked
			    , s: service
			    , source : source

			    , CORS: form.CORS.checked
			  }
			, $("#status"));
	}

	function ImageService(params) {
	    Services[params.value] = this;

	    this.type   = "image-service"
	    this.params = params;

	    this.retrieve = function (values, messages) {

		this.params.calc(values)

		var url = subst(this.params.url, values)
		
		xhr({ url: url, title: "Image", status: params.status, type: 'blob', CORS: values.CORS }, function(e, xhr) {
		    blob      = new Blob([xhr.response]);
		    blob.name = values.name

		    Fitsy.fitsopen(blob, function(fits) {
			    var hdu = fits.hdu[0];

			    if ( hdu.databytes === 0 && fits.hdu[1] !== undefined ) {
				hdu = fits.hdu[1];
			    }

			    Fitsy.dataread(fits, hdu, params.deliver);
		    });
		})
	    }
	}


	function JS9_Catalog(im, cat, regs) {
	    var i;

	    for ( i = 0; i < regs.length; i++ ) {
		JS9.Regions(im, regs[i])
	    }
	}

	function GetRADec() {
	    var im = JS9.GetImage()
	    var form = $(".JS9Archive-form")[0]

	    var coords = JS9.pix2wcs(im.iwcs, im.raw.header.NAXIS1/2, im.raw.header.NAXIS2/2).split(/ +/)

	    form.ra.value = coords[0]
	    form.dec.value = coords[1]

	    var c1 = JS9.Pix2WCS(im, 0,                    im.raw.header.NAXIS2/2)
	    var c2 = JS9.Pix2WCS(im, im.raw.header.NAXIS1, im.raw.header.NAXIS2/2)

	    form.width.value = Math.floor(Math.abs((c1[0]-c2[0])*60)*100)/100

	    var c1 = JS9.Pix2WCS(im, im.raw.header.NAXIS1/2,                    0)
	    var c2 = JS9.Pix2WCS(im, im.raw.header.NAXIS1/2, im.raw.header.NAXIS2)

	    form.height.value = Math.floor(Math.abs((c1[1]-c2[1])*60)*100)/100
	}

	function CatalogService(params) {
	    Services[params.value] = this;

	    this.type   = "catalog-service"
	    this.params = params;

	    this.table2cat = function(im, table) {
		var i
		var shape = this.params.shape;

		var xcol = table[this.params.xcol]
		var ycol = table[this.params.ycol]

		var wcol = 1;
		var hcol = 1;


		var pos_func = function(im, x, y) {
		    var coords = JS9.WCS2Pix(im, x, y)

		    return { x: coords[0], y: coords[1] }
		}
		var sizefunc;

		switch ( shape ) {
		 case "box":
		    sizefunc = function(row) {
			    return { width: 5, height: 5 };
		    	}
		    break;
		 case "circle":
		    sizefunc = function(row) {
			    return { radius: 2.5 };
		    	}
		    break;
		 case "ellipse":
		    sizefunc = function(row) {
			    return { width: 5, height: 5 };
		    	}
		    break;
		}

		regs = []
		for ( i = 0; i < table.data.length; i++ ) {
		    var pos = pos_func(im, table.data[i][xcol]*15, table.data[i][ycol])
		    var siz = sizefunc(im, table.data[i][wcol], table.data[i][hcol])

		    var reg = {   id: i.toString(), shape: shape
				, x: pos.x, y: pos.y
				, width: siz.width, height: siz.height, radius: siz.radius
				, angle: 0
			}

		    regs[i] = reg
		}

		return regs
	    }

	    this.retrieve = function (values, messages) {

		this.params.calc(values)

		var url = subst(this.params.url, values)
		
		var catalog = this;

		var reply = xhr({ url: url, title: "Catalog", status: "#status", CORS: values.CORS }, function(e) {
		    var table = new Starbase(reply.responseText, { type: { default: Strtod } })
		    var im    = JS9.GetImage();

		    $("#status").text("Found " + table.data.length.toString() + " rows")

		    JS9.Catalog(im, catalog.table2cat(im, table), { name: catalog.name })
		})
	    }
	}

	function NewArchiveBox(el) {
	    el.innerHTML = '<form class="JS9Archive-form">\
		<select class="service-menu"></select>\
		<select class="server-menu"></select>\
		<select class="source-menu"></select>\
		<table>\
		<tr><td> Object: </td> <td> <input type=text name=object size=10> </td>\
		    <td></td>\
		    <td></td>\
		    <td> <input type=button value=Go onclick="ServiceGo()"> </td>\
		    <td>&nbsp;&nbsp;</td>\
		    <td> <input type=checkbox name=gzip> Use Compression</td>\
		</tr>\
		<tr><td> RA:  	</td><td>	<input type=text name=ra	size=10> </td>\
		    <td> Dec: 	</td><td>	<input type=text name=dec	size=10> </td>\
		    <td> <input type=button value=Get onclick="GetRADec()"> </td>\
		    <td></td>\
		    <td> <input type=checkbox name=CORS checked> Use CORS Proxy</td>\
		<tr><td> Width: </td><td>	<input type=text name=width	size=10 value=15> </td>\
		    <td> Height: </td><td>	<input type=text name=height	size=10 value=15> </td>\
		</tr>\
		</tr>\
		<tr><td colspan=6><span id=status></span></td></tr>\
		</form>'

	    var mtyp = $(el).find(".service-menu");
	    var msrv = $(el).find(".server-menu");
	    var msrc = $(el).find(".source-menu");

	    $(mtyp).data("submenu", msrv);
	    $(msrv).data("submenu", msrc);
	    
	    imgmenu = []
	    $.each(Services, function(i, service) {
		if ( service.type !== "image-service" ) { return; }

		imgmenu.push({ text: service.params.text, value: service.params.value, subdata: service.params.surveys })
	    });

	    catmenu = []
	    $.each(Services, function(i, service) {
		if ( service.type !== "catalog-service" ) { return; }

		catmenu.push({ text: service.params.text, value: service.params.value, subdata: service.params.surveys })
	    });

	    $(mtyp).data("menu", [ { text: "Image Servers",   value: "imgserv", subdata: imgmenu }
			         , { text: "Catalog Servers", value: "catserv", subdata: catmenu }])

	    populateOptions(mtyp)
	}


   function populateOptions(s) {
	var select = s[0]
	var dataArray = $(s).data("menu")
	var submenu   = $(s).data("submenu")

        select.options.length = 0
        $.each(dataArray, function(index, data) {
            select.options[select.options.length] = new Option(data.text, data.value)

        });

	if ( submenu !== undefined ) {
	    $(submenu).data("menu", dataArray[select.selectedIndex].subdata)
	    populateOptions(submenu)

	    s.change(function() {
		$(submenu).data("menu", dataArray[select.selectedIndex].subdata)
		populateOptions(submenu);
	    })
	}
    }


JS9.RegisterPlugin(NewArchiveBox, ".JS9Archive")

