"use strict";
/*global window, DOMParser, ActiveXObject */
function returnXMLFromString(str){
	var parser = null, xmlStr = null;
	if(window.DOMParser !== undefined){
		parser = new DOMParser();
		try {
			xmlStr = parser.parseFromString(str, "application/xml");
		} catch(e){ xmlStr = parser.parseFromString(str, "text/xml"); }
	} else if(typeof window.ActiveXObject !== undefined){
		xmlStr = new ActiveXObject("Microsoft.XMLDOM");
		xmlStr.async = "false";
		xmlStr.loadXML(str); }
	return xmlStr; } 