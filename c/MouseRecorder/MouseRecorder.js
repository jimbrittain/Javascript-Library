"use strict";
/*global navigator, Coordinates, MouseRecorder, IMDebugger, document, window, fetter, setTimeout, clearTimeout, isHTMLElement, console, $*/

function isKindle(){
	if(isKindle.prototype.found !== undefined){ return isKindle.prototype.found; }
	var string_list = ['Silk', 'Kindle', 'KFAPW', 'KFTHW', 'KFSOW', 'KFJW', 'KFTT', 'KFOT'];
	var ua = navigator.userAgent, l = string_list.length, f=false;
	for(var i=0; i<l; i+=1){ if((new RegExp(string_list[i]).test(ua))){ f = true; break; }}
	isKindle.prototype.found = f;
	return f; }
/**
 * @method touchprotect
 * @param {Object} evt Event
 * @param {Boolean} r Returning for bubbling
 * 	@default true
 * @return {Boolean} true | false if set
 */
function touchprotect(evt, r){
	r = (r !== undefined || r === true) ? true : false;
	if(isKindle() || (navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/WebKit/i))){
		if('preventDefault' in evt){ evt.preventDefault(); }
		return false;
	} else { return r; }}
/* 
 * @module MouseRecorder
 * @author JDB - jim@immaturedawn.co.uk 2014
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2014
 * @version - 0.2.4
 * @requires isHTMLElement (fetter|jQuery), Coordinates
 * Revisions
 * 		0.2.4 - Fixed findInstance snafu
 * 		0.2.3 - rewritten to have private members;
 * 		0.2.2 - creates an always record function
 * 		0.2.1 - IMDebugger revises out console.log
 * 		0.2 - Revised to jshint strict debugging
*/

/*
 * @submodule MouseRecorderInstance
 * @constructor
 * @param {Object}
 * @notes used to create discreet, trackable MouseRecorder sessions so multiple uses don't conflict
 */
function MouseRecorderInstance(o){
	this.name = "";
	this.element = null;
	this.jsObject = null;
	this.type = 'click';
	
	this.controller = new MouseRecorder();
	this.record = false;
	this.coords = new Coordinates(-1,-1);
	
	this.init(o); }
/*
 * @method MouseRecorderInstance.init
 * @param {Object} {
 * 		name (String),
 *		element (HTMLElement),
 * 		jsObject (js Reference), 
 * 		type (String click|move|both)
 * }
 * @notes 
 * 	constructs Instance
 */
MouseRecorderInstance.prototype.init = function(args){
	this.name = ('name' in args && typeof args.name === 'string') ? args.name : "";
	this.element = ('element' in args && args.element !== undefined && isHTMLElement(args.element)) ? args.element : null;
	this.jsObject = ('jsObject' in args && typeof args.jsObject === 'object') ? args.jsObject : null;
	this.type = ('type' in args && typeof args.type === 'string' && (args.type === 'click' || args.type === 'move' || args.type === 'both')) ? args.type : 'click';
	
	if(this.type === 'click'){
		this.coords.x = this.controller.down.x;
		this.coords.y = this.controller.down.y;
	} else if(this.type === 'move'){
		this.coords.x = this.controller.move.x;
		this.coords.y = this.controller.move.y;
	} else {
		this.coords.x = this.controller.x;
		this.coords.y = this.controller.y; }};

function MouseRecorder(){
	if(MouseRecorder.prototype.singletonInstance){ return MouseRecorder.prototype.singletonInstance; }
	MouseRecorder.prototype.singletonInstance = this;
	this.types = {
		'click' : true, 
		'move'	: true };
	this.down = new Coordinates(-1,-1);
	this.move = new Coordinates(-1,-1);
	
	this.isdown = false;
	this.isdown_int = null;
	
	this.record = false;
	
	this.instances = [];
	
	this.always_record = false;
	var always_record = false;
	this.setAlwaysRecord = function(){ always_record = true; };
	this.getAlwaysRecord = function(){ return always_record; };
	
	this.x = -1;
	this.y = -1;
	var c = this;
	if('jQuery' in window){
		$(document).ready(function(){
			$(document).bind("touchstart.mm", function(e){ c.nowDown(); return true; });
			$(document).bind("touchend.mm", function(e){ c.nowUp(); return true; });
			$(document).bind("touchcancel.mm", function(e){ c.nowUp(); return true; });
			$(document).bind("touchup.mm", function(e){ c.nowUp(); return true; });
			$(document).bind("mousedown.mm", function(e){ c.recorder(e, 'click'); return true; });
			$(document).bind("touchstart.mmm", function(e){ c.recorder(e, 'click'); return c.compensateForKindle(e); });
			$(document).bind("mousemove.mm", function(e){ c.recorder(e, 'move'); return true; });
			$(document).bind("touchmove.mmm", function(e){ c.recorder(e, 'move'); return c.compensateForKindle(e); });
		}); 
	} else if(fetter !== undefined && typeof fetter === 'function'){
		var t = fetter(document, 'DOMContentLoaded', function(){
			fetter(document, 'touchstart', function(e){ c.nowDown(); return true; }, true);
			fetter(document, 'touchend', function(e){ c.nowUp(); return true; }, true);
			fetter(document, 'touchup', function(e){ c.nowUp(); return true;}, true);
			fetter(document, 'touchcancel', function(e){ c.nowUp(); return true;}, true);
			fetter(document, 'mousedown', function(e){ c.recorder(e, 'click'); return true; }, true);
			fetter(document, 'touchstart', function(e){ c.recorder(e, 'click'); return c.compensateForKindle(e); }, true);
			fetter(document, 'mousemove', function(e){ c.recorder(e, 'move'); return true; }, true);
			fetter(document, 'touchmove', function(e){ c.recorder(e, 'move'); return c.compensateForKindle(e); }, true);
		}, true, 'after');}}

MouseRecorder.prototype.setRecord = function(o){
	var fi = this.findInstanceId(o);
	if(fi !== -1){
		if(typeof fi === 'number'){ 
			return this._setRecordInstance(this.instances[fi]);
		} else if(fi.length && typeof fi !== 'string'){
			for(var i=0, imax = fi.length; i<imax; i+=1){
				this._setRecordInstance(this.instances[fi[i]]); }
			return true; }
	} else {
		var v = new MouseRecorderInstance(o);
		this.instances.push(v);
		this._setRecordInstance(v); }};
MouseRecorder.prototype._setRecordInstance = function(ins){
	if(ins instanceof MouseRecorderInstance){
		ins.record = true;
		if(!this.record){ this.record = true; }
		return true;
	} else { return false; }};
MouseRecorder.prototype.endRecord = function(o){
	var fi = this.findInstanceId(o);
	if(fi !== -1){
		if(typeof fi === 'number'){
			return this._setEndRecordInstance(this.instances[fi]);
		} else if(fi.length && typeof fi !== 'string'){
			for(var i=0, imax = fi.length; i<imax; i+= 1){
				this._setEndRecordInstance(this.instances[fi[i]]); }
			return true; }}
	return false; };
MouseRecorder.prototype._setEndRecordInstance = function(ins){
	if(ins instanceof MouseRecorderInstance){
		ins.record = false;
		var boo = false;
		for(var i=0, imax = this.instances.length; i<imax; i+=1){
			if(this.instances[i].record){
				boo = true;
				break; }}
		if(!boo){ this.record = false; }
	} else { return false; }};

MouseRecorder.prototype.getX = function(o){
	if(typeof o === 'string' && (o === 'click' || o === 'both' || o === 'move')){
		return this.defaultX(o);
	} else {
		var fi = this.findInstanceId(o);
		if(fi !== -1){
			if(typeof fi === 'number'){
				return (this.findInstance(fi)).coords.x;
			} else if(fi.length > 1 && typeof fi !== 'string'){
				var start = fi[0].type;
				for(var i=1, imax = fi.length; i<imax; i+=1){
					if(fi[i].type !== start){ start = 'both'; }
					if(start === 'both'){ break; }}
				return this.defaultX(start); }}
		return this.defaultX(); }};
MouseRecorder.prototype.getY = function(o){
	if(typeof o === 'string' && (o === 'click' || o === 'both' || o === 'move')){
		return this.defaultY(o);
	} else {
		var fi = this.findInstanceId(o);
		if(fi !== -1){
			if(typeof fi === 'number'){
				return (this.findInstance(fi)).coords.y;
			} else if(fi.length > 1 && typeof fi !== 'string'){
				var start = fi[0].type;
				for(var i=1, imax = fi.length; i<imax; i+=1){
					if(fi[i].type !== start){ start = 'both'; }
					if(start === 'both'){ break; }}
				return this.defaultY(start); }}
		return this.defaultY(); }};
MouseRecorder.prototype.getCoordinates = function(o){ return new Coordinates(this.getX(o), this.getY(o)); };


MouseRecorder.prototype.defaultX = function(o){
	if(o === 'move'){ return this.move.x; }
	if(o === 'click'){ return this.down.x; }
	return this.x; };
MouseRecorder.prototype.defaultY = function(o){
	if(o === 'move'){ return this.move.y; }
	if(o === 'click'){ return this.down.y; }
	return this.y; };


MouseRecorder.prototype.findInstanceId = function(o){
	var r = -1, i = 0, imax = 0;
	if(typeof o === 'object' && o instanceof MouseRecorderInstance){
		for(i=0, imax = this.instances.length; i < imax; i+=1){
			if(o === this.instances[i]){ return i; }}
		return -1;
	} else if(typeof o === 'number' && o > -1 && o < this.instances.length){
		return o;
	} else {
		if(typeof o === 'object'){
			var avail = this.instances, temp = [];
			if('name' in o && typeof o.name === 'string'){
				temp = [];
				for(i = 0, imax = avail.length; i < imax; i += 1){
					if(avail[i].name === o.name){ temp.push(avail[i]); }}
				avail = temp; }
			if(avail.length === 0){ return -1; }
			
			if('element' in o && typeof o.element === 'object' && o.element !== undefined && isHTMLElement(o.element)){
				temp = [];
				for(i = 0, imax = avail.length; i < imax; i += 1){
					if(avail[i].element === o.element){ temp.push(avail[i]); }}
				avail = temp; }
			if(avail.length === 0){ return -1; }
			
			if('jsObject' in o && typeof o.jsObject === 'object'){
				temp = [];
				for(i = 0, imax = avail.length; i < imax; i += 1){
					if(avail[i].jsObject === o.jsObject){ temp.push(avail[i]); }}
				avail = temp; }
			if(avail.length === 0){ return -1; }
			
			if('type' in o && typeof o.type === 'string'){
				temp = [];
				for(i = 0, imax = avail.length; i < imax; i += 1){
					if(avail[i].type === o.type){ temp.push(avail[i]); }}
				avail = temp; }
			if(avail.length > 1){
				var idList = [];
				for(i = 0, imax = avail.length; i < imax; i += 1){
					if(avail[i] instanceof MouseRecorderInstance){ idList.push(this.findInstanceId(avail[i])); }}
				if(idList.length === 1){
					return idList[0];
				} else { return idList; }
			} else if(avail.length === 1 && avail[0] instanceof MouseRecorderInstance){ 
				return this.findInstanceId(avail[0]);
			} else {
				return -1; }}}
	return -1; };
MouseRecorder.prototype.isInstance = function(o){ return (this.findInstanceId(o) === -1) ? false : true; };
MouseRecorder.prototype.findInstance = function(o){
	var fi = this.findInstanceId(o);
	if(fi === -1){
		return undefined;
	} else if(typeof fi === 'number'){
		return this.instances[fi];
	} else if('length' in fi && typeof fi !== 'string'){
		var temp = [];
		for(var i = 0, imax = fi.length; i<imax ; i+=1){
			temp.push(this.instances[fi[i]]); }
		if(temp.length > 1){
			return temp;
		} else if(temp.length === 1){ return temp[0]; 
		} else { return undefined; }}};
MouseRecorder.prototype.removeInstance = function(ins){
	if(ins instanceof MouseRecorderInstance){
		return this.removeInstanceFromId(this.findInstanceId(ins));
	} else { return false; }};
MouseRecorder.prototype.removeInstanceFromId = function(n){
	if(typeof n === 'number' && n > -1 && n < this.instances.length){
		this.instances.splice(n,1);
		return true;
	} else { return false; }};


MouseRecorder.prototype.compensateForKindle = function(e){
	if(isKindle() && this.isdown){
		touchprotect(e, true);
		return true;
	} else { return true; }};
MouseRecorder.prototype.nowDown = function(){
	if(!this.isdown && this.isdown_int === null){
		var c = this;
		this.isdown_int = setTimeout(function(){c.isdown = true;}, 25); }};
MouseRecorder.prototype.nowUp = function(){
	if(this.isdown_int !== null){ clearTimeout(this.isdown_int); }
	this.isdown = false; };
MouseRecorder.prototype.alwaysRecord = function(){ this.setAlwaysRecord(); }; //legacy code implementation;
MouseRecorder.prototype.recorder = function(e, t){
	var i = 0, imax = 0, r = {};
	t = (t === undefined || (t !== 'click' && t !== 'move')) ? 'click' : t;
	if(this.record || this.getAlwaysRecord()){
		var o = { 'x': -1, 'y': -1 };
		if('pageX' in e && e.pageX !== undefined){
			o.x = (e.pageX > 0) ? e.pageX : o.x;
			o.y = (e.pageY > 0) ? e.pageY : o.y;
		} else {
			e = ('originalEvent' in e) ? e.originalEvent : e;
			if(e.touches && e.touches.length && e.touches[0].pageX && e.touches[0].pageX !== undefined){
				this.x = e.touches[0].pageX;
				o.x = (e.touches[0].pageX > 0) ? e.touches[0].pageX : o.x;
				o.y = (e.touches[0].pageY > 0) ? e.touches[0].pageY : o.y;
			} else if(e.targetTouches && e.targetTouches.length && e.targetTouches[0].pageX && e.targetTouches[0].pageX !== undefined){
				o.x = (e.targetTouches[0].pageX > 0) ? e.targetTouches[0].pageX : o.x;
				o.y = (e.targetTouches[0].pageY > 0) ? e.targetTouches[0].pageY : o.y;
			} else if(e.changedTouches && e.changedTouches.length && e.changedTouches[0].pageX && e.changedTouches[0].pageX !== undefined){
				o.x = (e.changedTouches[0].pageX > 0) ? e.changedTouches[0].pageX : o.x;
				o.y = (e.changedTouches[0].pageY > 0) ? e.changedTouches[0].pageY : o.y; }}
		if(o.x !== -1 || o.y !== -1){
			this.x = (o.x !== -1) ? o.x : this.x;
			this.y = (o.y !== -1) ? o.y : this.y;
			if(t === 'click'){
				this.down.x = (o.x !== -1) ? o.x : this.down.x;
				this.down.y = (o.y !== -1) ? o.y : this.down.y;
				for(i=0, imax = this.instances.length; i<imax; i+=1){
					r = this.instances[i];
					if(r.record && (r.type === 'click' || r.type === 'both')){
						r.coords.x = this.down.x;
						r.coords.y = this.down.y; }}
			} else if(t === 'move'){
				this.move.x = (o.x !== -1) ? o.x : this.move.x;
				this.move.y = (o.x !== -1) ? o.y : this.move.y;
				for(i=0, imax = this.instances.length; i<imax; i+=1){
					r = this.instances[i];
					if(r.record && (r.type === 'move' || r.type === 'both')){
						r.coords.x = this.move.x;
						r.coords.y = this.move.y; }}}}}};

MouseRecorder.prototype.isOver = function(elem){
	if(elem !== undefined && isHTMLElement(elem)){
		var element = $(elem), elementPosition = element.position(), onco = null;
		var t = 'bulls'; //needs changing;
		 
		if(t === 'click'){
			onco = new Coordinates(this.down.x, this.down.y);
		} else if(t === 'move'){
			onco = new Coordinates(this.move.x, this.move.y);
		} else { onco = new Coordinates(this.x, this.y); }
		
		var result = (((elementPosition.top <= onco.y) && ((elementPosition.top + element.height()) >= onco.y)) && ((elementPosition.left <= onco.x) && ((elementPosition.left + element.width()) >= onco.x))) ? true : false;
		return result;
	} else {
		(new IMDebugger()).pass("MouseRecorder.isOver must be supplied a HTMLElement");
		return false; }};