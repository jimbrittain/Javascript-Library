"use strict";
/*global fetter, debounce, isHTMLElement, FixedPixelElement, window, isNumber, screen, Image, findElementStyle */
/*jshint -W069 */ // Turn off dot notation
/**
 * @class FixedPixelElements
 * @module FixedPixelElements
 * @requires isHTMLElement, isNumber, debounce, fetter
 * @constructor
 * @type Singleton
 */
function FixedPixelElements(){
	if(FixedPixelElements.prototype.singleton !== undefined){ return FixedPixelElements.prototype.singleton; }
	FixedPixelElements.prototype.singleton = this;
	this.initiated = false;
	this.naturaldpi = 96;
	this.zoom_compensate = false;
	this.parts = []; 
	var c = this;
	this.init();
	fetter(window, 'load', c.process, true); }
/**
 * FixedPixelElements.init
 * @method init
 * @requires fetter, debounce
 * @needs FixedPixelElements.process, FixedPixelElements.getDPI
 * @param {}
 * @return {}
 */
FixedPixelElements.prototype.init = function(){
	this.initiated = true;
	this.dpi = this.getDPI(); 
	var c = this;
	fetter(window, 'resize', function(){ debounce(function(){ c.process(); }, 500); }); };
/**
 * FixedPixelElements.getDPI
 * @method getDPI
 * @requires isNumber
 */
FixedPixelElements.prototype.getDPI = function(){
	if('devicePixelRatio' in window && isNumber(window.devicePixelRatio)){
		return window.devicePixelRatio * this.naturaldpi;
	} else if('logicalXDPI' in screen){
		return (screen.deviceXDPI / screen.logicalXDPI) * this.naturaldpi;
	} else { return 96; }};
/**
 * FixedPixelElements.add
 * @method add
 * @requires isHTMLElement, FixedPixelElement
 * @needs FixedPixelElements.findIndex
 * @param {HTMLElement} elem
 */
FixedPixelElements.prototype.add = function(elem){
	if(elem !== undefined && isHTMLElement(elem)){
		var o = this.findIndex(elem);
		if(o !== -1){
			return this.parts[o];
		} else {
			o = this.parts.length;
			this.parts.push(new FixedPixelElement(elem));
			return this.parts[o]; }
	} else { return undefined; }};
/**
 * FixedPixelElements.findIndex
 * @method findIndex
 * @requires isHTMLElement
 * @param {HTMLElement} elem
 * @return {Number} index of element or -1 for not found
 */
FixedPixelElements.prototype.findIndex = function(elem){
	if(elem !== undefined && isHTMLElement(elem)){
		for(var i=0, max = this.parts.length; i < max; i += 1){
			if(elem === this.parts[i].element){ return i; }}
		return -1;
	} else { return -1; }};
/**
 * FixedPixelElements.process
 * @method process
 * @requires FixedPixelElement.process
 * @param {}
 * @return {}
 */
FixedPixelElements.prototype.process = function(){ for(var i=0, max = this.parts.length; i < max; i += 1){ this.parts[i].process();}};
/**
 * @module FixedPixelElement
 * @submodule FixedPixelElement
 * @constructor
 * @requires isHTMLElement
 * @param {HTMLElement} elem
 */
function FixedPixelElement(elem){
	this.master = new FixedPixelElements();
	this.element = null;
	this.naturalWidth = 0;
	this.naturalHeight = 0; 
	this.init(elem); }
/**
 * FixedPixelElement.init
 * @method init
 * @param {Object} elem
 * @return {}
 */
FixedPixelElement.prototype.init = function(elem){
	if(elem !== undefined && isHTMLElement(elem)){
		this.element = elem;
		if('naturalWidth' in elem){
			this.naturalWidth = parseFloat(elem.naturalWidth);
			this.naturalHeight = parseFloat(elem.naturalHeight);
		} else {
			if(('nodeName' in elem && elem.nodeName.toLowerCase() === 'img') || ('tagName' in elem && elem.tagName.toLowerCase() === 'img') && 'src' in elem){
				var ti = new Image(); //this doesn't have a fallback if image not loaded;
				ti.src = elem.src;
				this.naturalWidth = ti.width;
				this.naturalHeight = ti.height;
			} else {
				this.naturalWidth = findElementStyle(elem, 'offsetWidth');
				this.naturalHeight = findElementStyle(elem, 'offsetHeight'); }}
		this.process(); }};
/**
 * FixedPixelElement.process
 * @method process
 * @param {}
 * @return {}
 */
FixedPixelElement.prototype.process = function(){
	if(this.element !== undefined && isHTMLElement(this.element)){
		this.element.style['width'] = this.naturalWidth/(this.master.dpi/this.master.naturaldpi) + 'px';
		this.element.style['height'] = this.naturalHeight/(this.master.dpi/this.master.naturaldpi) + 'px'; }};