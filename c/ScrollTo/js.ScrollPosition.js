"use strict";
/*jshint -W069 */
/*globals isHTMLElement, inVisibleDOM, clearTimeout, BoundaryCoordinates, getAttributer, setAttributer, setTimeout, findElementByID, isArray, ScrollPositional, console, Animation, ScreenProperties, findElementStyle, window, document, Coordinates, fetter, unfetter */

/* needs 
 * 		check new AnimationMaster,
 * 		quick and dirty scroller;
 * 		better way of adding the ScrollPositions and ScrollPositionals, ScrollPositionals in particular should be noted in Master;
 */


/* 
 * js.ScrollPosition.js and js.ScrollPosition.min.js
 * @module ScrollPositional
 * @author JDB - jim@immaturedawn.co.uk 2015
 * @url - http://www.immaturedawn.co.uk
 * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * @copyright - Immature Dawn 2015
 * @version - 0.2
 * @requires isHTMLElement, inVisibleDOM, BoundaryCoordinates, getAttributer, isArray, ScrollPositional, console, Animation, ScreenProperties, findElementStyle, window, fetter
*/

/*
 * @submodule ScrollPositionMaster
 * @constructor
 * @param none
 * @notes singleton, used to refer to ScrollPositional instances, provide global modules,
 * 			and through use of (new ScrollPositionMaster()).scrollToElement(), a quick scroller;
 * 			Also contains default scrolling animation properties, and animation instance.
 */
function ScrollPositionMaster(){
	if(ScrollPositionMaster.prototype.singleton !== undefined){ return ScrollPositionMaster.prototype.singleton; }
	ScrollPositionMaster.prototype.singleton = this;
	this.child_id = 0;
	this.default_anim_props = {
		'duration' : 2000, 
		'timingFunction' : 'ease-in-out'};
	this.anim = null; //all share same animation as can only function independently;
	this.scrollCheckElement = null;
	this.possible = false;
	this.justdone = false;
	this.timeout_id = null;
	this.timeout_ms = 5;
	this.init();
	return this; }
/*
 * @method ScrollPositionMaster.init
 * @param none
 * @notes 
 * 	currently only used to build scroll hider, could add ability to change default_anim_props here?
 */
ScrollPositionMaster.prototype.init = function(){ this.createScrollHider(); };
/*
 * @method ScrollPositionMaster.createScrollHider
 * @param none
 * @notes 
 * 	builds a hidden element, which is used to control scrolling with a unique id;
 * 	must be fired after DOMContentLoaded, handled by use of fetter.
 */

ScrollPositionMaster.prototype.userCancelInit = function(){
	fetter(window, 'scroll', function(){ (new ScrollPositionMaster()).userCancel(); }, true); };
ScrollPositionMaster.prototype.userCancelAbort = function(){
	unfetter(window,'scroll', function(){ (new ScrollPositionMaster()).userCancel(); }, true); };
ScrollPositionMaster.prototype.userCancel = function(){
	if(!this.justdone){
		if(this.anim.animating){ 
			this.anim.pause(); 
			this.anim.clear(); 
			this.userCancelAbort(); }
	} else { return true; }};

ScrollPositionMaster.prototype.createScrollHider = function(){
	if(this.scrollCheckElement === null){
		fetter(document, 'DOMContentLoaded', function(){
			var el = null;
			if('createElement' in document && 'appendChild' in document.body){
				el = document.createElement('div');
				setAttributer(el, 'id', 'spm_scrollcheckelement');
				setAttributer(el, 'style', 'visibility:hidden !important;position:absolute;top:0;left:0;z-index:10000000;');
				document.body.appendChild(el);
			} else {
				el = "<div id=\"spm_scrollcheckelement\" style=\"visibility:hidden !important;position:absolute;top:0;left:0;z-index:10000000;\"></div>";
				if('body' in document && 'innerHTML' in document.body){ document.body.innerHTML += el; }
				el = findElementByID('spm_scrollcheckelement'); }
			(new ScrollPositionMaster()).scrollCheckElement = (el !== undefined && isHTMLElement(el)) ? el : null;
			(new ScrollPositionMaster()).possible = ((new ScrollPositionMaster().scrollCheckElement) !== null) ? true : false;
		}, true, 'after'); }};
ScrollPositionMaster.prototype.animateTo = function(dest, axis){
	if(this.anim !== null){ this.anim.pause(); this.anim.clear(); }
	this.anim = new Animation(this.default_anim_props);
	this.anim.element = this.scrollCheckElement;
	this.anim.element.style['top'] = (new ScreenProperties()).offsetY() + 'px';
	this.anim.element.style['left'] = (new ScreenProperties()).offsetX() + 'px';
	this.anim.forceJSAnimation = true;
	this.userCancelAbort();
	this.userCancelInit();
	this.anim.addEndFunction(function(){
		(new ScrollPositionMaster()).userCancelAbort();
	});
	if(!(dest instanceof Coordinates) && !isNaN(Number(dest))){ dest = new Coordinates(dest, dest); }
	axis = (axis === 'x' || axis === 'y' || axis === 'both') ? axis : 'y';
	if(axis === 'y' || axis === 'both'){
		this.anim.addProperty({
			'name' : 'custom_scroll_y', 
			'start' : (new ScreenProperties()).offsetY(), 
			'end' : dest.y, 
			'custom' : {
				'get' : function(e){ 
					var elem = (new ScrollPositionMaster()).scrollCheckElement;
					return findElementStyle(elem, 'top');
				}, 
				'set' : function(e, v){ 
					var n = new ScrollPositionMaster();
					var elem = n.scrollCheckElement;
					elem.style['top'] = v;
					n.justdone = true;
					window.scroll(Math.round(parseFloat(findElementStyle(elem, 'left'))), Math.round(parseFloat(v)));
					if(n.timeout_id !== null){ clearTimeout(n.timeout_id); n.timeout_id = null; }
					n.timeout_id = setTimeout(function(){ 
						(new ScrollPositionMaster()).justdone = false;
						n.timeout_id = null; }, n.timeout_ms); }
			}
		}); }
	if(axis === 'x' || axis === 'both'){
		this.anim.addProperty({
			'name' : 'custom_scroll_x', 
			'start' : (new ScreenProperties()).offsetX(), 
			'end' : dest.x, 
			'custom' : {
				'get' : function(e){ 
					var elem = (new ScrollPositionMaster()).scrollCheckElement;
					return findElementStyle(elem, 'left');
				}, 
				'set' : function(e, v){ 
					var n = new ScrollPositionMaster();
					n.scrollCheckElement.style['left'] = v;
					var elem = n.scrollCheckElement;
					n.justdone = true;
					window.scroll(parseInt(v), parseInt(findElementStyle(elem, 'top')));
					if(n.timeout_id !== null){ clearTimeout(n.timeout_id); n.timeout_id = null; }
					n.timeout_id = setTimeout(function(){ 
						(new ScrollPositionMaster()).justdone = false;
						n.timeout_id = null; }, n.timeout_ms);
				}
			}
		}); }
	this.anim.run();
	return true;
};
ScrollPositionMaster.prototype.scrollToElement = function(elem, axis){
	if(elem !== undefined && isHTMLElement(elem)){
		var n = new ScrollPositional({'elements': elem});
		if(axis !== undefined){ n.setAxis(axis); }
		n.goto(elem); }};

function ScrollPosition(elem){
	this.element = null;
	this.coordinates = null;
	this.id = '';
	if(elem !== undefined){ this.init(elem); }}
ScrollPosition.prototype.init = function(elem){ this.setElement(elem); };
ScrollPosition.prototype.setElement = function(elem){
	if(elem !== undefined && isHTMLElement(elem) && inVisibleDOM(elem)){
		this.element = elem;
		this.coordinates = new BoundaryCoordinates(this.element);
		this.id = getAttributer(this.element, 'id'); 
		return true; }
	return false; };




function ScrollPositional(o){
	this.master = new ScrollPositionMaster();
	this.enabled = false;
	this._functional = null;
	this.positions = [];
	this.axis = 'y'; 
	if(o !== undefined){ this.init(o); }}
ScrollPositional.prototype.init = function(o){
	if('elements' in o){ this.addElements(o.elements); }
	if('functional' in o){ this.setFunctional(o.functional); }};
ScrollPositional.prototype.isFunctional = function(){ return (this._functional !== null && typeof this._functional === 'function')? this._functional() : true; };
ScrollPositional.prototype.setFunctional = function(f){
	if(f !== undefined && typeof f === 'function'){
		this._functional = f;
		return true; }
	return false; };
ScrollPositional.prototype.setAxis = function(a){
	if(typeof a === 'string'){
		a = a.toLowerCase();
		switch(a){
			case 'x':
			/*falls through*/
			case 'horizontal':
				this.axis = 'x';
				break;
			case 'both':
				this.axis = 'both';
				break;
			case 'y':
			/*falls through*/
			case 'vertical':
			/*falls through*/
			default:
				this.axis = 'y'; }
	} else {
		this.axis = 'y';
	}
	return this.axis; };
ScrollPositional.prototype.addElement = function(arr){
	var sp, starting = this.positions.length;
	arr = (!isArray(arr)) ? [arr] : arr;
	for(var i=0, imax = arr.length; i<imax; i+=1){
		if(arr[i] !== undefined && isHTMLElement(arr[i])){
			sp = new ScrollPosition();
			if(sp.setElement(arr[i])){ this.positions.push(sp); }}}
	if(this.positions.length > 0){
		this.enabled = true;
		return (this.positions.length > starting) ? true : false; //this checks if has added any, not full passed;
	}
	return false; };
ScrollPositional.prototype.addElements = ScrollPositional.prototype.addElement; //pseudonym for addElement

//pass element, returns i in this.positions[i] or -1 if not exists;
ScrollPositional.prototype.findPositionByElement = function(elem){
	if(elem !== undefined && isHTMLElement(elem) && inVisibleDOM(elem)){
		for(var i=0, imax = this.positions.length; i<imax; i += 1){
			if(this.positions[i].element === elem){ return this.positions[i]; }}}
	return -1; };
//pass id string, returns i in this.positions[i] or -1 if not exists;
ScrollPositional.prototype.findPositionById = function(id){
	if(id !== undefined && typeof id === 'string' && id.length > 0){
		for(var i=0, imax = this.positions.length; i<imax; i += 1){
			if(this.positions[i].id === id){ return this.positions[i]; }}}
	return -1; };
//pass i returns this.positions[i] if i, and this.positions[i] instanceof ScrollPosition, or -1 if not;
ScrollPositional.prototype.findPositionByIndex = function(n){
	n = Number(n);
	return (!isNaN(n) && n > -1 && parseInt(n) === n && n < this.positions.length && this.positions[n] instanceof ScrollPosition) ? this.positions[n] : -1; };

//returns correct ScrollPosition for o or -1 if invalid; 
ScrollPositional.prototype.findPositional = function(o){
	if(!(o instanceof ScrollPosition)){
		var check = o;
		o = (check !== undefined && isHTMLElement(check)) ? this.findPositionByElement(check) : -1;
		o = (o === -1) ? this.findPositionByIndex(check) : o;
		o = (o === -1) ? this.findPositionById(check) : o;
		if(o === -1){ return -1; } //else carries on;
	} else {
		var f = false;
		for(var i = 0, imax = this.positions.length; i<imax; i+=1){
			if(o === this.positions[i]){ o = this.positions[i]; f = true; break; }}
		if(!f){ return -1; }}
	return (o instanceof ScrollPosition) ? o : -1; };

ScrollPositional.prototype.whichIndex = function(){
	var o, y = (new ScreenProperties()).offsetY(), last = -1, y1;
	for(var i=0, imax = this.positions.length; i<imax; i+=1){
		o = this.positions[i];
		if(o.element !== undefined && isHTMLElement(o.element) && inVisibleDOM(o.element)){
			var b = new BoundaryCoordinates(o.element);
			if(b.isOver((new ScreenProperties()).offsetX(), (new ScreenProperties()).offsetY())){ return i; }}}
	return last; };
ScrollPositional.prototype.whichPosition = function(){
	var o = this.whichIndex();
	return (o !== -1) ? this.positions[o] : -1; };
//Significant, returns empty string if id is undefined on ScrollPosition/element
ScrollPositional.prototype.whichId = function(){
	var o = this.whichIndex();
	return (o !== -1 && this.positions[o].id !== '') ? this.positions[o].id : ''; };
//Significant, returns null if element is undefined on ScrollPosition, shouldn't ever happen
ScrollPositional.prototype.whichElement = function(){
	var o = this.whichIndex();
	return (o !== -1) ? this.positions[o].element : null; };
ScrollPositional.prototype.goto = function(o){
	if(this.enabled && this.isFunctional()){
		o = this.findPositional(o);
		var n = this.whichPosition();
		if(o !== n && o !== -1){
			//var newY = o.coordinates.getY1();
			var d = new Coordinates(o.coordinates.getX1(), o.coordinates.getY1());
			return this.master.animateTo(d, this.axis); }}
	return false; };
