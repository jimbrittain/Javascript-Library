"use strict";
/*global document, console, IMDebugger */
/**
 * @module findElementByID
 * @author Immature Dawn
 * @copyright JDB 2014
 * @version 0.2
 * @date 20140407
 * @param {String} _id
 * @return {HTMLElement}
 */
function findElementByID(_id){
	if(typeof _id  === "string"){
		if('getElementById' in document){
			return document.getElementById(_id);
		} else if(document.all){
			return document.all[_id];
		} else if('layers' in document){
			return document.layers[_id];
		} else { return undefined; }
	} else {
		(new IMDebugger()).pass("findElementByID must be supplied a string.");
	}}