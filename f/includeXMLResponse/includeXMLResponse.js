"use strict";
/*jshint -W069 */
/* global isHTMLElement, findElementByID */
/* variables for default */
var includeXMLResponse = function(elem_str, txt){
	var targetElem = findElementByID(elem_str);
	if(targetElem !== undefined && isHTMLElement(targetElem)){
		if(targetElem.childNodes && targetElem.appendChild){
			if(targetElem.childNodes.length > 0){
				for(var i=0; i<targetElem.childNodes.length; i+=1){
					targetElem.removeChild(targetElem.childNodes[i]); }}
			targetElem.innerHTML = txt;
		} else { targetElem.innerHTML = txt; }}};
