"use strict";
/*global isNumber */
/**
 * whatmeasure
 * @method whatmeasure
 * @param {Object} m
 * @return {String|undefined}
 * 	@notes Assumes an unsuffixed number is a pixel value
 * @requires isNumber
 */
function whatmeasure(m){
	m = (isNumber(m)) ? m + '' : m;
	var re = /^([-+]?[0-9]*\.?[0-9]+)(px|rem|ch|vh|vw|vmin|vmax|%|ex|em|in|cm|mm|pc|pt|mozmm|deg)$/;
	var a = m.match(re);
	if(!a){
		var re2 = /^[-+]?[0-9]*\.?[0-9]+$/;
		return (m.match(re2)) ? 'px' : undefined;
	} else { return (a[2]) ? a[2] : undefined; }}
