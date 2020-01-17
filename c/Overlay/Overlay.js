"use strict";
/*jshint -W069 */
/*global isHTMLElement, Animation, findElementStyle, BoundaryCoordinates, setInterval, clearInterval, fetter, PerfectCurve, document, SupportedCSSProperty, preventEvent, console, findElementByID */
function Overlay(elem){
	if(Overlay.prototype.singleton !== undefined){
		return (elem !== undefined) ? Overlay.prototype.singleton.init(elem) : Overlay.prototype.singleton;
	}
	Overlay.prototype.singleton = this;
	this.initiated = false;
	this.active = true;
	this.element = "";
	
	this._isOpen = null;
	this._isClosed = null;
	this._start = null;
	this._end = null;
	
	this.openprops = [];
	this.closeprops = [];
	
	this.animation = new Animation();
	if(elem !== undefined){ this.init(elem); }
}
Overlay.prototype.addStartAnimationFunction = function(f){
	if(f !== undefined && typeof f === 'function'){ 
		this._start = f;
		return true; }
	return false; };
Overlay.prototype.addEndAnimationFunction = function(f){
	if(f !== undefined && typeof f === 'function'){ 
		this.end = f;
		return true; }
	return false; };
Overlay.prototype.resetDefaults = function(){
	this._isOpen = null;
	this._isClosed = null;
	this._start = null;
	this._end = null;
	
	this.openprops = [];
	this.closeprops = []; };

Overlay.prototype.init = function(elem){
	this.element = (elem !== null && isHTMLElement(elem)) ? elem : null;
	this.parentElement = (this.element.parentElement) ? this.element.parentElement : ((this.element.parentNode) ? this.element.parentNode : null);
	this.resetDefaults();
	if(this.element !== null){
		this.initiated = true;
		if(!this.hasCloseButton()){ this.buildCloseButton(); }}
	return this; };
Overlay.prototype.setActive = function(boo){ this.active = ((boo === undefined || boo) && this.element !== null) ? true : false; };
Overlay.prototype.setIsOpen = function(f){ 
	if(f !== undefined && typeof f === 'function'){
		this._isOpen = f;
		return true; }
	return false; };
Overlay.prototype.isOpen = function(){ return (this._isOpen !== null && typeof this._isOpen === 'function') ? this._isOpen() : false; };
Overlay.prototype.setIsClosed = function(f){ 
	if(f !== undefined && typeof f === 'function'){ 
		this._isClosed = f;
		return true; }
	return false; };
Overlay.prototype.isClosed = function(){
	if(this._isClosed !== null && typeof this._isClosed === 'function'){
		return this._isClosed();
	} else if(this._isOpen !== null && typeof this._isOpen === 'function'){
		return (this._isOpen()) ? false : true;
	} else { return false; }};
Overlay.prototype.toggle = function(){ return (this.isOpen()) ? this.close() : this.open(); };
Overlay.prototype.open = function(){
	if(this.active && this.initiated){
		if(!this.isOpen() && this.openprops.length > 0){
			if(this._start !== null){ this._start(); }
			if(this.animation !== null && this.animation.animating){ this.animation.pause(); }
			var o = {
				'element' : this.element, 
				'descriptor' : 'overlayanimation', 
				'duration' : 1500, 
				'timingFunction' : 'ease-in-out' };
			if(this._end !== null && typeof this._end === 'function'){ o.endFunction = this._end; }
			this.animation = new Animation(o);
			for(var i=0, imax=this.openprops.length; i<imax; i+=1){
				this.animation.setProperty(this.openprops[i]); }
			this.animation.run();
		}
		return true; }
	return false; };
Overlay.prototype.close = function(){
	if(this.active && this.initiated){
		if(!this.isClosed() && this.closeprops.length > 0){
			if(this._start !== null){ this._start(); }
			if(this.animation !== null && this.animation.animating){ this.animation.pause(); }
			var o = {
				'element' : this.element, 
				'descriptor' : 'overlayanimation', 
				'duration' : 1500, 
				'timingFunction' : 'ease-in-out' };
			this.animation = new Animation(o);
			if(this._end !== null && typeof this._end === 'function'){ o.endFunction = this._end; }
			for(var i=0, imax=this.closeprops.length; i<imax; i+=1){
				this.animation.setProperty(this.closeprops[i]); }
			this.animation.run(); }
		return true; }
	return false; };
Overlay.prototype.hasCloseButton = function(){
	if(this.initiated && this.element !== null && isHTMLElement(this.element)){
		var e = findElementByID('overclose');
		//should check that overclose is inside element;
		return (e !== null && e !== undefined && isHTMLElement(e)) ? true : false; }
	return false; };
Overlay.prototype.buildCloseButton = function(){
	if(this.initiated && !this.hasCloseButton()){
		if(this.element !== null && isHTMLElement(this.element)){
			if('innerHTML' in this.element){
				this.element.innerHTML = this.element.innerHTML + '<a id="overclose">&#215;</a>';
			} else {
				if('createElement' in document && 'appendChild' in this.element){
					var e = document.createElement('a');
					e.setAttribute('id', 'overclose');
					this.element.appendChild(e); }}}}
	var n = findElementByID('overclose');
	if(n !== undefined && isHTMLElement(n)){
		var c = this;
		fetter(n, 'click', function(e){ c.toggle(); preventEvent(e); }, false); 
		fetter(n, 'touchstart', function(e){ c.toggle(); preventEvent(e); }, false);
		return true; }
	return false; };
Overlay.prototype.setOpenProperty = function(p, e){ this.openprops.push({'name':p, 'end': e }); };
Overlay.prototype.setCloseProperty = function(p, e){ this.closeprops.push({'name':p, 'end': e }); };