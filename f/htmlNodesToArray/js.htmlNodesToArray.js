"use strict";
function htmlNodesToArray(m){
	if('length' in m){
		var n = [];
		for(var i=0, imax=m.length; i<imax; i+=1){ n.push(m[i]); }
		return n; } else { return m; }}
