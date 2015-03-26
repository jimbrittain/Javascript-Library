"use strict";
/*global isHTMLElement, findParent */
function isChildOf(child, parent){
	if(child !== undefined && isHTMLElement(child) && parent !== undefined && isHTMLElement(parent)){
		var p = findParent(child);
		while(p !== undefined){
			if(p === parent){
				return true;
			} else { p = findParent(p); }}}
	return false; }
