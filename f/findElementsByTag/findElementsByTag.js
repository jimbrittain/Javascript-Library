"use strict";
/*global document*/
function findElementsByTag(_tag){
	var returnArray = [];
	if('getElementsByTagName' in document){
		returnArray = document.getElementsByTagName(_tag);
	} else if('all' in document && 'tags' in document.all){
		returnArray = document.all.tags(_tag);
	} else if('links' in document){ returnArray = document.links; }
	return returnArray; }