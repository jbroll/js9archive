
function I(x) { return x }
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

function Starbase(data, options) {
    var i, j

    this.head = {}
    this.type = []
    this.data = []

    data = data.substring(0, data.length-1).split("\n")
    line = 0

    if ( options && options.skip ) {
	while ( data[line++][0] == options.skip ) { }
    }

    this.headline = data[line++].trim().split(/ *\t */)
    this.dashline = data[line++].trim().split(/ *\t */)

    dashes = this.dashline.length * (this.dashline == '' ? 0 : 1)

    // Read lines until the dashline is found
    //
    while ( dashes === 0 || dashes != this.headline.length ) {

	this.headline = this.dashline
	this.dashline = data[line++].trim().split(/ *\t */)

	dashes = this.dashline.length * (this.dashline == '' ? 0 : 1)
    }

    // Create a vector of type converters
    //
    for ( i = 0; i < this.headline.length; i++ ) {
	if ( options && options.type && options.type[this.headline[i]] ) {
	    this.type[i] = options.type[this.headline[i]]
	} else {
	    if ( options && options.type && options.type.default ) {
		this.type[i] = options.type.default;
	    } else {
		this.type[i] = I
	    }
	}
    }

    // Read the data in and convert to type[]
    //
    for ( j = 0; line < data.length; line++, j++ ) {
	this.data[j] = data[line].split('\t')

	for ( i = 0; i < this.data[j].length; i++ ) {
	    this.data[j][i] = this.type[i](this.data[j][i])
	}
    }

    for ( i = 0; i < this.headline.length; i++ ) {
	this[this.headline[i]] = i
    }
}

