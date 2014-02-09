/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */

"use strict";


exports.Services = {};

exports.Register = function(name, obj) {
	exports.Services[name] = obj;
};
