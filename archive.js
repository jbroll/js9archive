
xhr = require("./xhr")
Strtod = require("./strtod")

Remote = require("./remote-service")

require("./image-services");
require("./catalog-services");

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
	var server  = Remote.Services[service]

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

    function NewArchiveBox(el) {
	el.innerHTML = '<form class="JS9Archive-form">\
	    <select class="service-menu"></select>\
	    <select class="server-menu"></select>\
	    <select class="source-menu"></select>\
	    <table>\
	    <tr><td> Object: </td> <td> <input type=text name=object size=10> </td>\
		<td></td>\
		<td></td>\
		<td> <input type=button value=Go class="service-go"> </td>\
		<td>&nbsp;&nbsp;</td>\
		<td> <input type=checkbox name=gzip> Use Compression</td>\
	    </tr>\
	    <tr><td> RA:  	</td><td>	<input type=text name=ra	size=10> </td>\
		<td> Dec: 	</td><td>	<input type=text name=dec	size=10> </td>\
		<td> <input type=button value=Get class="get-ra-dec"> </td>\
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

	$(el).find(".service-go").click(ServiceGo);
	$(el).find(".get-ra-dec").click(GetRADec);
	
	imgmenu = []
	$.each(Remote.Services, function(i, service) {
	    if ( service.type !== "image-service" ) { return; }

	    imgmenu.push({ text: service.params.text, value: service.params.value, subdata: service.params.surveys })
	});

	catmenu = []
	$.each(Remote.Services, function(i, service) {
	    if ( service.type !== "catalog-service" ) { return; }

	    catmenu.push({ text: service.params.text, value: service.params.value, subdata: service.params.surveys })
	});

	$(mtyp).data("menu", [ { text: "Image Servers",   value: "imgserv", subdata: imgmenu }
			     , { text: "Catalog Servers", value: "catserv", subdata: catmenu }])

	populateOptions(mtyp)
    }

module.exports = NewArchiveBox;
