"use strict";
/* global findElementsByTag, findElementStyle, window, document, screen */
function MyScreen(){
	if(MyScreen.prototype.singleton !== undefined){ return MyScreen.prototype.singleton; }
	MyScreen.prototype.singleton = this;
	this.bounds = {};
	this.offset = {};
	this.screen = {
		'width' : function(){ return ('width' in screen) ? screen.width : undefined; }, 
		'height' : function(){ return ('height' in screen) ? screen.height : undefined; }};
	this.window = {
		'width' : function(){ return ('outerWidth' in window) ? window.outerWidth : undefined; }, 
		'height' : function(){ return ('outerHeight' in window) ? window.outerHeight : undefined; }};
	this.visible = {
		'width' : function(){ return (this.documentWidth() > this.innerWindowWidth()) ? this.documentWidth() : this.innerWindowWidth(); }, 
		'height' : function(){ return (this.documentHeight() > this.innerWindowHeight()) ? this.documentHeight() : this.innerWindowHeight(); }};
	this.document = {
		'width' : function(){ return this.documentWidth(); }, 
		'height' : function(){ return this.documentHeight(); }};
		
	this.pageWidth = this.visible.width;
	this.pageHeight = this.visible.height;
	/* legacy support */
	this.vW = this.visible.width;
	this.vH = this.visible.height;
	this.pO_x = function(){ return (this.getPageOffset()).x; };
	this.pO_y = function(){ return (this.getPageOffset()).y; };
	this.dW = this.document.width;
	this.dH = this.document.height;
	this.pW = function(){ return (this.getPageBounds()).width; };
	this.pH = function(){ return (this.getPageBounds()).height; };
	this.sW = this.screen.width;
	this.sH = this.screen.height;
	this.wW = this.window.width;
	this.wH = this.window.height;
		
	this.getPageBounds();
	this.getPageOffset();
}
//Offset and Scrolling Functions ::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Probably need to have a look at getComputedStyle and the W3c equivalent for completeness;
MyScreen.prototype.screenOffsetX = function(){
	if(arguments.length === 1 && typeof arguments[0] === 'number'){
		this.scrollTo(arguments[0], this.screenOffsetY);
	} else {
		if('pageXOffset' in window){
			return window.pageXOffset;
		} else if(document.documentElement && 'scrollLeft' in document.documentElement){
			return document.documentElement.scrollLeft;
		} else if('scrollLeft' in document.body){
			return document.body.scrollLeft;
		} else if(document.body.scroll && 'left' in document.body.scroll){
			return document.body.scroll.left;
		} else if('scrollX' in window){ return window.scrollX; }
		return undefined; }};
MyScreen.prototype.screenOffsetY = function(){
	if(arguments.length === 1 && typeof arguments[0] === 'number'){
		this.scrollTo(this.screenOffsetX, arguments[0]);
	} else {
		if('pageYOffset' in window){
			return window.pageYOffset;
		} else if(document.documentElement && 'scrollTop' in document.documentElement){
			return document.documentElement.scrollTop;
		} else if('scrollTop' in document.body){
			return document.body.scrollTop;
		} else if(document.body.scroll && 'top' in document.body.scroll){
			return document.body.scroll.top;
		} else if('scrollY' in window){ return window.scrollY; }
		return undefined; }};
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
MyScreen.prototype.getPageBounds = function(){
	this.bounds = {};
	this.bounds = {
		'left' : this.pageOffsetX(), 
		'top' : this.pageOffsetY(), 
		'right' : 0, 
		'bottom' : 0 };
	this.bounds.right = this.bounds.left + this.pageWidth();
	this.bounds.bottom = this.bounds.bottom + this.pageHeight(); 
	return this.bounds;
}; 
MyScreen.prototype.getPageOffset = function(){
	this.offset = {
		'x' : this.pageOffsetX(), 
		'y' : this.pageOffsetY()};
	return this.offset; };
MyScreen.prototype.documentWidth = function(){
	var temp = "";
	var bodyArr = findElementsByTag('html');
	if(bodyArr.length === 1){
		temp = findElementStyle(bodyArr[0], 'width');
		return parseInt(temp); }
	if('clientWidth' in document.body){
		return document.body.clientWidth;
	} else if (document.documentElement && 'clientWidth' in document.documentElement){ 
		return document.documentElement.clientWidth; }
};
MyScreen.prototype.documentHeight = function(){
	var temp = "";
	var bodyArr = findElementsByTag('html');
	if(bodyArr.length === 1){
		temp = findElementStyle(bodyArr[0], 'height');
		return parseInt(temp); }
	if('clientHeight' in document.body){
		return document.body.clientHeight;
	} else if(document.documentElement && 'clientHeight' in document.documentElement){ 
		return document.documentElement.clientHeight; }
};
MyScreen.prototype.innerWindowWidth = function(){
	if('innerWidth' in window){
		return window.innerWidth;
	} else if(document.documentElement && 'clientWidth' in document.documentElement && document.documentElement.clientWidth !== 0){
		return document.documentElement.clientWidth;
	} else if('clientWidth' in document.body){
		return document.body.clientWidth; }};
MyScreen.prototype.innerWindowHeight = function(){
	if('innerHeight' in window){
		return window.innerHeight;
	} else if(document.documentElement && 'clientHeight' in document.documentElement && document.documentElement.clientHeight !== 0){
		return document.documentElement.clientHeight;
	} else if('clientHeight' in document.body){
		return document.body.clientHeight; }};
MyScreen.prototype.scrollTo = function(x, y){
	if(window.scrollTo){
		window.scrollTo(x, y);
	} else if(window.scroll){
		window.scroll(x, y);
	}};

