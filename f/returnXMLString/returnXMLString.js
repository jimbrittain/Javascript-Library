"use strict";
/*jshint -W002 */
/*global XMLSerializer */
function returnXMLString(rXML){ //Code based on http://www.sourcelabs.com/blogs/ajb/2006/04/rocky_shoals_of_ajax_developme.html by Alex Bosworth
	var text = '';
	if(rXML.responseXML){
		try {
			var serializer = new XMLSerializer();
			text = serializer.serializeToString(rXML.responseXML);
		} catch (e) {
			try {
				text = rXML.responseXML.xml;
			} catch (e) { }
		}}
	text = ((text === '' || text === undefined) && rXML.responseText) ? rXML.responseText : text;
	text = (typeof text !== 'string') ? '' : text;
	return text; }