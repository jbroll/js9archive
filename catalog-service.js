
var RemoteService = require("./remote-service")

var Starbase = require("./starbase")
var subst    = require("./subst")

function CatalogService(params) {
    RemoteService.Register(params.value, this);

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

module.exports = CatalogService;
