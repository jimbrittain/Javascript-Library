"use strict";
/*global HTMLElement, IMDebugger, console*/
function isHTMLElement(elem){
	var hasHTMLElement = false;
	try {
		if(HTMLElement !== undefined) { hasHTMLElement = true;}
	} catch(e1){}
	if(elem !== null){
		if(hasHTMLElement && typeof elem === 'object'){
			return ((elem instanceof HTMLElement) ? true : false);
		} else {
			try {
				if('nodeType' in elem){ return ((elem.nodeType === 1) ? true : false);
				} else if('tagName' in elem){ return (elem.tagName !== null) ? true : false;
				} else { return ('canHaveHTML' in elem) ? true : false; }
			} catch(e2) {
				try {
					if(elem.nodeType){ return ((elem.nodeType === 1) ? true : false); 
					} else if(elem.tagName){ return (elem.tagName !== null) ? true : false; 
					} else { return (elem.canHaveHTML) ? true : false; }
				} catch(e3) {} 
				return false;
			}}
	} else {
		(new IMDebugger()).pass("isHTMLElement must be supplied something.");
		return false; }}