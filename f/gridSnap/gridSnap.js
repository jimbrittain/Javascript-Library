"use strict";
/*global isNumber*/
function gridSnap(n, pg){
	var r = 0;
	if(isNumber(n) && isNumber(pg)){
		r = (Math.ceil(n/pg)) * pg;
		r = (isNumber(r)) ? r : 0; }
	return r; }