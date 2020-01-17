"use strict";
/* global document, window */
function WhenWindowLoads(){
	if(WhenWindowLoads.prototype.singletonInstance){ return WhenWindowLoads.prototype.singletonInstance; }
	WhenWindowLoads.prototype.singletonInstance = this;
	this.created = false;
	this.finished = false;
	this.loaded = false;
	this.func_arr = []; }
WhenWindowLoads.prototype.process = function(){
	while(this.func_arr.length > 0){
		var f = this.func_arr.shift();
		if(typeof f === 'function'){ f(); }}};
WhenWindowLoads.prototype.add = function(_fun){
	if(typeof _fun === 'function'){
		if(!this.finished){
			var isLoaded = false;
			if(document.readyState){
				isLoaded = (document.readyState === 'complete') ? true : false; 
			} else if('loaded' in window){ isLoaded = window.loaded; }
			if(isLoaded){
				this.finished = true;
				this.loaded = true; }}
		if(this.loaded){ _fun(); } else { this.addToQueue(_fun); }
	} else { return false; }};
WhenWindowLoads.prototype.addToQueue = function(_fun){
	var c = this;
	if(!this.created){
		if(window.addEventListener){
			window.addEventListener("load", function(){ c.process(); }, true);
		} else if(window.attachEvent){
			window.attachEvent('onload', function(){ c.process(); });
		} else {
			if(document.getElementById){
				if(typeof window.onload === "function"){ this.func_arr.push(window.onload); }
				window.onload = function(){ c.process(); };
			}}
		this.created = true; }
	if(typeof _fun === 'function'){ 
		var canAdd = true;
		for(var i=0, imax = this.func_arr.length; i < imax; i += 1){if(this.func_arr[i] === _fun){ canAdd = false; break; }}
		if(canAdd){ this.func_arr.push(_fun); }}};
WhenWindowLoads.prototype.removeFromQueue = function(_fun){ 
	for(var i=0; i<this.func_arr.length; i += 1){ 
		if(_fun === this.func_arr[i]){ this.func_arr.splice(i, 1); }}};