"use strict";
/*global Coordinates, isNumber */
/*
 * 	To Use for CSS CubicBezierCoordinates.findYPositionFromX(n) where n is a 0-1 fraction in time.
 */

/**
 * @class CubicBezierCoordinates
 * @module CubicBezierCoordinates
 * @constructor
 * 
 * @requires Coordinates
 * 
 * @version 0.2
 * @author Immature Dawn
 * @copyright JDB 2014
 * 
 * @property p0
 * 	@type Coordinates
 * 	@default null
 * @property p1
 * 	@type Coordinates
 * 	@default null
 * 
 * @property cp0 (Control Point 0)
 * 	@type Coordinates
 * 	@default null
 * 
 * @property cp1 (Control Point 1)
 * 	@type Coordinates
 * 	@default null
 * @property initialised
 * 	@type Boolean
 * 	@default false
 * 	@notes Should really be a private property
 */

function CubicBezierCoordinates(){
	this.p0 = null;
	this.p1 = null;
	
	this.cp0 = null;
	this.cp1 = null;

	this.initialised = false;
	this.iterations = 10;
	this.len = 100; 
	this.arc_lengths = [];
	this.arc_ys = [];
	this.arc_xs = [];
	this.length = null; }
/**
 * CubicBezierCoordinates.reset
 * @method reset
 * @param {}
 * @return {Boolean} True
 */
CubicBezierCoordinates.prototype.reset = function(){
	this.arcs_ys = [];
	this.arcs_xs = [];
	this.arc_lengths = [];
	this.length = null;
	this.initialised = false;
	return true; };
/**
 * CubicBezierCoordinates.determine_arc_ys
 * @method determine_arc_ys
 * @needs CubicBezierCoordinates.calculateYPosition
 * @param {}
 * @return {}
 */
CubicBezierCoordinates.prototype.determine_arc_ys = function(){
	this.arc_ys = [];
	this.arc_ys[0] = 0;
	for(var i=1, max = this.len; i < max; i += 1){
		this.arc_ys[i] = this.calculateYPosition(i/this.len); }};
/**
 * CubicBezierCoordinates.determine_arc_xs
 * @method determine_arc_xs
 * @needs CubicBezierCoordinates.calculateXPosition
 * @param {}
 * @return {}
 */
CubicBezierCoordinates.prototype.determine_arc_xs = function(){
	this.arc_xs = [];
	this.arc_xs[0] = 0;
	for(var i=1, max = this.len; i < max; i += 1){
		this.arc_xs[i] = this.calculateXPosition(i/this.len); }};
/**
 * CubicBezierCoordinates.determine_lengths
 * @method determine_lengths
 * @needs CubicBezierCoordinates.calculateXPosition, CubicBezierCoordinates.calculateYPosition
 * @param {}
 * @return {}
 */
CubicBezierCoordinates.prototype.determine_lengths = function(){
	var ox = this.calculateXPosition(0), oy = this.calculateYPosition(0), clen = 0;
	this.arc_lengths = [];
	this.arc_lengths[0] = 0;

	for(var i = 1, max = (this.len + 1); i < max; i +=1){
		var x = this.calculateXPosition(i/this.len), y = this.calculateYPosition(i/this.len), dx = ox - x, dy = oy - y;
		clen += Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		this.arc_lengths[i] = clen;
		ox = x;
		oy = y; }
	this.length = clen; };
/**
 * CubicBezierCoordinates.cssSet
 * @method cssSet
 * @param {}
 * @return {Boolean}
 */
CubicBezierCoordinates.prototype.cssSet = function(){
	this.setPoint0(0,0);
	this.setPoint1(1,1);
	var a = (arguments.length === 1 && typeof arguments[0] === 'string') ? this.stringStrip(arguments[0]) : this.arguments;
	if(a.length === 2 && a[0] instanceof Coordinates && a[1] instanceof Coordinates){
		this.setControlPoint0(a[0]);
		this.setControlPoint1(a[1]); 
		return true;
	} else if(arguments.length === 4){
		this.setControlPoint0(a[0], a[1]);
		this.setControlPoint1(a[2], a[3]);
		return true;
	} else { return false; }};
/**
 * CubicBezierCoordinates.setPoint0
 * @method setPoint0
 * @requires Coordinates
 * @needs CubicBezierCoordinates.reset
 * @param {Coordinates | 2 length array}
 * @return {}
 */
CubicBezierCoordinates.prototype.setPoint0 = function(){ 
	this.p0 = (arguments[0] !== undefined && arguments[0] instanceof Coordinates) ? arguments[0] : (new Coordinates(arguments[0], (arguments[1] !== undefined) ? arguments[1]: undefined)); 
	if(this.initialised){ this.reset(); }};
/**
 * CubicBezierCoordinates.setPoint1
 * @method setPoint1
 * @requires Coordinates
 * @needs CubicBezierCoordinates.reset
 */
CubicBezierCoordinates.prototype.setPoint1 = function(){ 
	this.p1 = (arguments[0] !== undefined && arguments[0] instanceof Coordinates) ? arguments[0] : (new Coordinates(arguments[0], (arguments[1] !== undefined) ? arguments[1]: undefined));
	if(this.initialised){ this.reset(); }};
/**
 * CubicBezierCoordinates.setControlPoint0
 * @method setControlPoint0
 * @requires Coordinates
 * @needs CubicBezierCoordinates.reset
 * @param {Coordinates | 2 length array}
 * @return {}
 */
CubicBezierCoordinates.prototype.setControlPoint0 = function(){
	this.cp0 = (arguments[0] !== undefined && arguments[0] instanceof Coordinates) ? arguments[0] : (new Coordinates(arguments[0], (arguments[1] !== undefined) ? arguments[1]: undefined));
	if(this.initialised){ this.reset(); }};
/**
 * CubicBezierCoordinates.setControlPoint1
 * @method setControlPoint1
 * @requires Coordinates
 * @needs CubicBezierCoordinates.reset
 * @param {Coordinates | 2 length array}
 * @return {}
 */
CubicBezierCoordinates.prototype.setControlPoint1 = function(){ 
	this.cp1 = (arguments[0] !== undefined && arguments[0] instanceof Coordinates) ? arguments[0] : (new Coordinates(arguments[0], (arguments[1] !== undefined) ? arguments[1]: undefined));
	if(this.initialised){ this.reset(); }};
/**
 * CubicBezierCoordinates.stringStrip
 * @method stringStrip
 * @notes Should really look at a more sucscint way of doing this regex?
 * @param {String} s
 * @return {Array} if successful, two Coordinates if not, empty array
 */
CubicBezierCoordinates.prototype.stringStrip = function(s){
	if(typeof s === 'string'){
		s = (s.indexOf('cubic-bezier(') === 0) ? s.substring(13) : s;
		s = (s.indexOf('(') === 0) ? s.substring(1) : s;
		s = (s.lastIndexOf(')') === (s.length -1)) ? s.substring(0, s.length - 1) : s;
		var a = s.split(',');
		if(a.length === 4){
			for(var i=0, max = a.length; i < max; i += 1){ a[i] = (isNumber(a[i])) ? a[i] : 0; }
			return [new Coordinates(a[0], a[1]), new Coordinates(a[2], a[3])];
		} else { return []; }
	} else { return []; }};
/**
 * CubicBezierCoordinates.map
 * Developed from http://gamedev.stackexchange.com/questions/5373/moving-ships-between-two-planets-along-a-bezier-missing-some-equations-for-acce
 * @method map
 * @param {Object} t
 * @return {}
 */
CubicBezierCoordinates.prototype.map = function(t){
	var target_length = t * this.arc_lengths[this.len], low = 0, high = this.len, i = 0;
	while(low < high){
		i = low + (((high - low) / 2) | 0);  // what does the single tide denote?
		if(this.arc_lengths[i] < target_length){
			low = i + 1;
		} else { high = i; }}
	if(this.arc_lengths[i] > target_length){ i -= 1; }
	var length_before = this.arc_lengths[i];
	return (length_before === target_length) ? i/this.len : (i + (target_length)/(this.arc_lengths[i+1] - length_before)) / this.len; };

CubicBezierCoordinates.prototype.map_lengthsX = function(t){ return this.calculateXPosition(this.map(t)); };
CubicBezierCoordinates.prototype.map_lengthsY = function(t){ return this.calculateYPosition(this.map(t)); };

CubicBezierCoordinates.prototype.map_arcs = function(n, xory){
	var i = 0, imax = 0;
	xory = (xory === undefined || !xory) ? true : false;
	var tab = (xory === undefined || !xory) ? this.arc_xs : this.arc_ys;
	if(tab.length === 0){ 
		if(xory) {
			this.determine_arc_ys();
			tab = this.arc_ys;
		} else { 
			this.determine_arc_xs();
			tab = this.arc_xs; }}
	var target = n;
	var low = 0, high = tab.length;
	var low_index = 0, high_index = tab.length;
	for(i=0, imax = tab.length; i < imax; i += 1){
		var a = tab[i];
		if(a > low && a < target){
			low = a;
			high = tab[i + 1];
			low_index = i;
			high_index = i + i;
		} else {
			while(high <= target){
				high_index += 1;
				high = tab[high_index]; }
			break; }}
	n = 0;
	while(n < this.iterations){
		var diff = (high_index - low_index)/2;
		var test = (xory) ? this.calculateYPosition((low_index + diff)/this.len) : this.calculateXPosition((low_index + diff)/this.len);
		if(test > low && test < target){
			low = test;
			low_index = low_index + diff;
		} else if(test > target && test < high){
			high = test;
			high_index = low_index + diff;
		} else if(test === target){
			high_index = low_index + diff;
			low_index = high_index + diff;
			break; }
		n += 1; }
	return ((high_index + low_index)/2)/100; };
CubicBezierCoordinates.prototype.map_arcsY = function(x){ return this.map_arcs(x, true); };
CubicBezierCoordinates.prototype.map_arcsX = function(y){ return this.map_arcs(y, true); };
CubicBezierCoordinates.prototype.findYPositionFromX = function(x){ return this.calculateYPosition(this.map_arcsX(x)); };
CubicBezierCoordinates.prototype.findXPositionFromY = function(y){ return this.calculateXPosition(this.map_arcsY(y)); };
CubicBezierCoordinates.prototype.calculateXPosition = function(t){
	//step 1: de Castelijau
	var a = ((1 - t) * this.p0.x) + (t * this.cp0.x);
	var b = ((1 - t) * this.cp0.x) + (t * this.cp1.x);
	var c = ((1 - t) * this.cp1.x) + (t * this.p1.x);
	//step 2: de Castelijau
	var d = ((1 - t) * a) + (t * b);
	var e = ((1 - t) * b) + (t * c);
	//step 3: de Castelijau
	return ((1 - t) * d) + (t * e); };
CubicBezierCoordinates.prototype.calculateYPosition = function(t){
	var a = ((1 - t) * this.p0.y) + (t * this.cp0.y);
	var b = ((1 - t) * this.cp0.y) + (t * this.cp1.y);
	var c = ((1 - t) * this.cp1.y) + (t * this.p1.y);
	var d = ((1 - t) * a) + (t * b);
	var e = ((1 - t) * b) + (t * c);
	return ((1 - t) * d) + (t * e); };

CubicBezierCoordinates.prototype.calculatePositionFromT = function(t){
	return new Coordinates(
		this.calculateXPosition(t), 
		this.calculateYPosition(t)); };