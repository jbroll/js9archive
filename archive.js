
	Services = {}

 	function xhr(params, func) {
	    var title = ""

	    if ( params.proxy ) {
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
	    var form = $("#archive-box")[0]

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

	    var service = form.service.options[form.service.selectedIndex].value.split(":")
	    var source  = form.service.options[form.service.selectedIndex].innerHTML
	    var server  = Services[service[0]]
	    
	    service = service[1]
	    
	    if ( form.object.value !== "" ) {
		simbad=encodeURI('http://hopper.si.edu/http/simbad?' + form.object.value)

		xhr({ url: simbad, title: "Name", status: "#status" }, function(e, xhr) {
		    var coords = xhr.responseText.split(" ");

		    form.ra.value  = coords[0]
		    form.dec.value = coords[1]

		    $("#status").text("");

		    server.retrieve({ name: form.object.value, e: "J2000", h: h.toString(), w: w.toString()
				    , r: form.ra.value, d: form.dec.value
				    , c: form.gzip.checked
				    , s: service
				    , source : source

				    , proxy: form.proxy.checked
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

			    , proxy: form.proxy.checked
			  }
			, $("#status"));
	}

	function ImageService(params) {
	    Services[params.id] = this;

	    this.type   = "image-service"
	    this.params = params;

	    this.retrieve = function (values, messages) {

		this.params.calc(values)

		var url = subst(this.params.url, values)
		
		xhr({ url: url, title: "Image", status: params.status, type: 'blob', CORS: values.proxy }, function(e, xhr) {
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
	    var form = $("#archive-box")[0]

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
	    Services[params.id] = this;

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

		var reply = xhr({ url: url, title: "Catalog", status: "#status", CORS: values.proxy }, function(e) {
		    var table = new Starbase(reply.responseText, { type: { default: Strtod } })
		    var im    = JS9.GetImage()

		    JS9_Catalog(im, catalog.name, catalog.table2cat(im, table))
		})
	    }
	}

	function NewArchiveBox(el) {
	    el.innerHTML = '<form class="archive-box">\
		<ul class="service-menu">\
		    <li><a href="#">Image Services</a>  <ul class="image-services"> </ul></li>\
		    <li><a href="#">Catalog Services</a><ul class="catalog-services"></ul></li>\
	        </ul>\
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
		    <td> <input type=checkbox name=proxy checked> Use CORS Proxy</td>\
		<tr><td> Width: </td><td>	<input type=text name=width	size=10 value=15> </td>\
		    <td> Height: </td><td>	<input type=text name=height	size=10 value=15> </td>\
		</tr>\
		</tr>\
		<tr><td colspan=6><span id=status></span></td></tr>\
		</form>'

	    var menu;
	    
	    menu = $(el).find(".image-services")

	    $.each(Services, function(i, service) {
		if ( service.type !== "image-service" ) { return; }

		menu.append('<li><a href="#">' + service.params.descrip + '</a></li>')
	    });

	    menu = $(el).find(".catalog-services")

	    $.each(Services, function(i, service) {
		if ( service.type !== "catalog-service" ) { return; }

		menu.append('<li><a href="#">' + service.params.descrip + '</a></li>')
	    });

	    $(el).find(".service-menu").menu()
	}

JS9.RegisterPlugin(NewArchiveBox, ".JS9Archive")

