"use strict";
/* global isHTMLElement */
function replaceInnerContent(elem, replacement){
	if(elem !== undefined && isHTMLElement(elem) && typeof replacement === 'string'){
		if('innerHTML' in elem){
			elem.innerHTML = replacement;
			return true;
		} else if('textContent' in elem && typeof replacement === 'string'){
			elem.textContent = replacement;
			return true;
		} else { return false; }
	} else { return false; }}