"use strict";
/*global Event, window*/
function preventEvent(e){
	if(e === undefined || !(e instanceof Event)){ e = window.event; }
	if('stopPropagation' in e){ e.stopPropagation(); }
	if('preventBubble' in e){ e.preventBubble(); }
	if('preventDefault' in e){ e.preventDefault(); }
	if('cancelBubble' in e){ e.cancelBubble = true; }
	if('returnValue' in e){ e.returnValue = false; }
	return false; } 
