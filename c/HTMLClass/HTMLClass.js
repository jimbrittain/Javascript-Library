"use strict";
/* global isHTMLElement, Attributer, getAttributer,setAttributer,removeAttributer */

function HTMLClass() {
	if(HTMLClass.prototype.singleton !== undefined){ 
		return HTMLClass.prototype.singleton; }
	HTMLClass.prototype.singleton = this; }

HTMLClass.prototype.returnClasses = function(str){
	if(typeof str === 'string'){
		if(str.length > 0){
			if(str.indexOf(" ") !== -1){
				var arr = str.split(" ");
				return arr;
			} else { return [str]; }
		} else { return []; }
	} else { return []; }};
HTMLClass.prototype.validClassName = function(n){
	//add validater, difficult as some browsers allow non-syntatic class names.
	return true;
};
HTMLClass.prototype.hasClass = function(o, n){
	//probably should validate, strip classname (n)
	var current = (o !== undefined && isHTMLElement(o)) ? (new Attributer()).get(o, 'class') : "";
	current = this.returnClasses(current);
	if(current.length > 0){
		var found = false;
		for(var i=0, imax = current.length; i < imax; i += 1){
			if(current[i] === n){
				found = true;
				break; }}
		return found;
	} else { return false; }};
HTMLClass.prototype.addClass = function(o, n){
	if(!this.hasClass(o, n)){
		var current = (o !== undefined && isHTMLElement(o)) ? (new Attributer()).get(o, 'class') : "";
		current = this.returnClasses(current);
		current.push(n);
		var newClassStr = current.join(" ");
		return setAttributer(o, 'class', newClassStr);
	} else { return false; }};
HTMLClass.prototype.removeClass = function(o, n){
	if(this.hasClass(o, n)){
		var current = (o !== undefined && isHTMLElement(o)) ? (new Attributer()).get(o, 'class') : "";
		current = this.returnClasses(current);
		for(var i = 0, imax = current.length; i < imax; i += 1){
			if(current[i] === n){
				current.splice(i, 1); //doesn't break in case error means > 1
				i -= 1; }}
		return setAttributer(o, 'class', current.join(" "));
	} else { return true; }};
