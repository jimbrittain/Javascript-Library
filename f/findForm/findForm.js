"use strict";
/*global isHTMLElement, window, $*/
//requires isHTMLElement
function findForm(elem){
	var f = null;
	if(elem !== null && isHTMLElement(elem)){
		if(elem.form && elem.form !== null){ 
			f = elem.form; 
		} else if(window.jquery){
			f = $(elem).closest('form')[0];
			f = (!isHTMLElement(f)) ? null : f;
		} else {
			var e = elem;
			while(e !== null && isHTMLElement(e)){
				e = (elem.parentNode) ? elem.parentNode : ((elem.parentElement) ? elem.parentElement : null);
				if(e.tagName && e.tagName.toLowerCase() === 'form'){
					f = e;
					e = null; }}}}
	return f;}
