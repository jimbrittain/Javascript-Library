"use strict";
function convertCSSdimensions(val, to_val){
	function isKeyword(val){
		var patt = /(^thick$)|(^thin$)|(^medium$)/;
		return (val.match(patt)) ? true : false; }
	function isEm(val){
		return (val.indexOf('em') !== -1) ? true : false; }
	function isPx(val){
		return (val.indexOf('px') !== -1) ? true : false; }
	function isEx(val){
		return (val.indexOf('ex') !== -1) ? true : false; }
	
	function emTopx(val){
		var theFig = val.substr(0, val.length - 2);
		theFig *= 16;
		val = Math.round(theFig);
		return val; }
	function emToex(val){ return val; }
	function pxToem(val){
		var theFig = val.substr(0, val.length - 2);
		theFig /= 16;
		return theFig; }
	function pxToex(val){ return val; }
	function exToem(val){ return val; }
	function exTopx(val){ return val; }
	function convertKeyword(val){ //at present use IE settings for thick thin medium
		switch (val){
			case "thick":
				return "5px";
			case "thin":
				return "1px";
			case "medium":
				return "3px"; }}
	function convertToPixels(val){
		if(isPx(val)){
			return Number(val.substr(0, val.length - 2));
		} else if(isEm(val)){
			return Number(emTopx(val));
		} else if(isEx(val)){
			return Number(exTopx(val));
		} else { return undefined; }}
	function convertToEm(val){
		if(isPx(val)){
			return pxToem(val);
		} else if(isEm(val)){
			return val.substr(0, val.length-2);
		} else if(isEx(val)){
			return exToem(val);
		} else { return undefined; }}
	function convertToEx(val){
		if(isPx(val)){
			return pxToex(val);
		} else if(isEm(val)){
			return emToex(val);
		} else if(isEx(val)){
			return val.substr(0, val.length-2);
		} else { return undefined; }}
	
	if(val === "auto"){ return undefined; }
	if(val === 0){ return 0; }
	if(isKeyword(val)){ val = convertKeyword(val); }
	var r = '';
	switch(to_val){
		case "px":
			return convertToPixels(val);
		case "ex":
			return convertToEx(val);
		case "em":
			return convertToEm(val);
		default:
			return convertToPixels(val); }
	return undefined; }