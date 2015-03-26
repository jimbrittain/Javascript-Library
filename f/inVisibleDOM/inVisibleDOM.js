"use strict";
/*global isHTMLElement, IMDebugger, console, document*/
/**
 * @module inVisibleDOM
 * @requires isHTMLElement
 * @param {Object} elem
 * @return {Boolean} true | false
 */
function inVisibleDOM(elem){
	var found = false, broken = false;
	if(elem !== undefined && isHTMLElement(elem)){
		if('parentNode' in elem || 'parentElement' in elem){
			while(elem !== null && !broken && !found){
				if(elem === document){ 
					found = true; break;
				} else {
					if('parentNode' in elem || 'parentElement' in elem){
						elem = ('parentNode' in elem) ? elem.parentNode : elem.parentElement;
					} else { broken = true; break; }}}
			return found;
		} else { return false; }
	} else {
		(new IMDebugger()).pass("inVisibleDOM provided a none HTMLElement.");
		return false; }}
