"use strict";
/*global setInterval, clearInterval, isNumber, Debounced*/
function Debouncer(){
	if(Debouncer.prototype.singleton !== undefined){ return Debouncer.prototype.singleton; }
	Debouncer.prototype.singleton = this;
	this.f = []; }
Debouncer.prototype.find = function(f, t){
	var d = false;
	for(var i=0, imax = this.f.length; i<imax; i += 1){ if(this.f[i].func === f){ d = true; return this.f[i]; }}
	if(!d){
		this.f.push(new Debounced(f, t));
		return this.f[this.f.length - 1]; }};
function Debounced(func, t){
	this.func = func;
	this.interval = null;
	this.time = (isNumber(t) && Math.floor(t) === t) ? t : 1000;
	this.has = false;
	this.set = function(){ 
		if(this.interval === null){
			this.has = false;
			this.clear();
			var c = this;
			this.interval = setInterval(function(){ c.apply(); c.has = false; }, this.time); 
		} else { this.has = true; }};
	this.apply = function(){
		this.func();
		if(!this.has){ this.clear(); }};
	this.clear = function(){ if(this.interval !== null){ clearInterval(this.interval); this.interval = null; this.has = false; }};
}
function debounce(fun, t){ (new Debouncer()).find(fun, t).set(); }
