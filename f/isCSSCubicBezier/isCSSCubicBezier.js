"use strict";
/**
 * @function isCSSCubicBezier
 * @param {String} s
 * @return {Boolean}
 * Regular Expression check for if a string is correctly formatted as CSS Cubic Bezier definition;
 */
function isCSSCubicBezier(s){
	if(typeof s === 'string'){
		var reg = /^cubic-bezier\(((0(\.[0-9]+)?)|(1(\.[0]+)?)),[ ]*([-+]?[0-9]*\.?[0-9]+),[ ]*((0(\.[0-9]+)?)|(1(\.[0]+)?)),[ ]*([-+]?[0-9]*\.?[0-9]+)\)$/;
		return reg.test(s);
	} else { return false; }}
