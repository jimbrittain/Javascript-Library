"use strict";
/* global window, fetter, document, setInterval */
/**
 * ResizeOutOfFocus
 * Object that creates/fires a resize event even when the window is out of focus this is useful as
 * otherwise programtic firing may not occur, e.g. open browser tab with resize function, new tab
 * resize window, look back, won't have fired. 
 * Requires JQuery needs rewriting so it doesn't, just needs the onload function removed and then a proper resize event rather than bind.
 * @author JDB - jim@immaturedawn.co.uk 2013
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2013
 * @version - 0.1
 * to call new ResizeOutOfFocus(); */
function ResizeOutOfFocus(){
	if(ResizeOutOfFocus.prototype.singleton){ return ResizeOutOfFocus.prototype.singleton; }
	ResizeOutOfFocus.prototype.singleton = this;
	this.beenDone = false;
	this.often = 2000;
	this.width = 0;
	this.height = 0;
	this._int = null;
	this.init(); }
ResizeOutOfFocus.prototype.init = function(){
	if(this._int === null){
		var c = this;
		fetter(window, 'load', function(){
			c.width = c.getWidth();
			c.height = c.getHeight();
			c._int = setInterval(function(){
				c.check();
			}, c.often);
		}, true);
		fetter(window, 'resize', function(){
			c.beenDone = true;
		}, true);  }};
ResizeOutOfFocus.prototype.getWidth = function(){
	if(document.body && document.body.offsetWidth){
		return parseInt(document.body.offsetWidth);
	} else if('innerWidth' in window){
		return parseInt(window.innerWidth);
	} else { 
		var e = (document.documentElement) ? document.documentElement : document.getElementsByTagName('body')[0];
		if('clientWidth' in e){
			return e.clientWidth;
		} else { return this.width; }
	}};
ResizeOutOfFocus.prototype.getHeight = function(){
	if(document.body && document.body.offsetHeight){
		return parseInt(document.body.offsetHeight);
	} else if ('innerHeight' in window){
		return parseInt(window.innerHeight);
	} else { 
		var e = (document.documentElement) ? document.documentElement : document.getElementsByTagName('body')[0];
		if('clientHeight' in e){
			return e.clientHeight;
		} else { return this.height; }
	}};
ResizeOutOfFocus.prototype.check = function(){
	var obj = {};
	if(!this.beenDone){
		if(this.width !== this.getWidth() || this.height !== this.getHeight()){
			this.width = this.getWidth();
			this.height = this.getHeight();
			if('onresize' in window && (window.onresize instanceof Function)){
				window.onresize();
			} else if(document.createEvent){
				try {
					obj = document.createEvent('Event');
					obj.initEvent('resize', true, false);
					window.dispatchEvent(obj);
				} catch(e) {}
			} else if(document.createEventObject){
				try {
					obj = document.createEventObject(window.event);
					window.event.srcElement.fireEvent ("onresize", obj);
				} catch(e) {}}}
	} else {
		this.width = this.getWidth();
		this.height = this.getHeight();
		this.beenDone = false; }};
var im_resizeoutoffocus = new ResizeOutOfFocus();
