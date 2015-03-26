"use strict";
/* global isHTMLElement, findElementStyle, window, $ */
/*jshint -W069 */
function BoundaryCoordinates(args){
	var _x1 = "", _x2 = "", _y1 = "", _y2 = "", _width = "", _height = "";
	var _getx1 = null, _getx2 = null, _gety1 = null, _gety2 = null, _getwidth = null, _getheight = null;
	
	this.x1 = 0;
	this.x2 = 0;
	this.y1 = 0;
	this.y2 = 0;
	this.width = 0;
	this.height = 0;
	this.left = 0;
	this.right = 0;
	this.top = 0;
	this.bottom = 0;
	
	this.element = null;
	this.elementType = "HTML";
	
	this.method = "set";
	
	var _get = function(){
		if(this.method === "get"){
			if(_getx1 !== null && _getx2 !== null){
				this.setX1(this.getX1());
				this.setX2(this.getX2());
				if(_getwidth !== null){
					this.setWidth(this.getWidth());
				} else { this.setWidth(this.x2 - this.x1); }
			} else if(_getx1 !== null && _getwidth !== null){
				this.setX1(this.getX1());
				this.setWidth(this.getWidth());
				this.setX2(this.x1 + this.width);
			} else if(_getx2 !== null && _getwidth !== null){
				this.setX2(this.getX2());
				this.setWidth(this.getWidth());
				this.setX2(this.x2 - this.width);
			} else {
				this.setX1(this.getX1());
				this.setX2(this.getX2());
				this.setWidth(this.getWidth()); }
			
			if(_gety1 !== null && _gety2 !== null){
				this.setY1(this.getY1());
				this.setY2(this.getY2());
				if(_getheight !== null){
					this.setHeight(this.getHeight());
				} else { this.setHeight(this.y2 - this.y1); }
			} else if(_gety1 !== null && _getheight !== null){
				this.setY1(this.getY1());
				this.setHeight(this.getHeight());
				this.setX2(this.y1 + this.height);
			} else if(_gety2 !== null && _getheight !== null){
				this.setY2(this.getY2());
				this.setHeight(this.getHeight());
				this.setY1(this.y2 - this.height);
			} else {
				this.setY1(this.getY1());
				this.setY2(this.getY2());
				this.setHeight(this.getHeight()); }
			this.buildAliases(); }};
	var _setX1 = function(x){
		_x1 = x;
		this.x1 = x;
		if(_width !== "" || this.width !== 0){
			this.x2 = this.x1 + this.width;
		} else if(_x2 !== "" || this.x2 !== 0){
			this.fixcoords();
			this.width = this.x1 - this.x2; }
		this.buildAliases(); };
	var _setX2 = function(x){
		_x2 = x;
		this.x2 = x;
		if(_width !== "" || this.width !== 0){
			this.x1 = this.x2 - this.width;
		} else if(_x1 !== "" || this.x1 !== 0){
			this.fixcoords();
			this.width = this.x2 - this.x1; }
		this.buildAliases(); };
	var _setWidth = function(w){
		_width = w;
		this.width = w;
		if(_x1 !== ""){
			this.x2 = this.x1 + this.width;
		} else if(_x2 !== ""){
			this.x1 = this.x2 - this.width; }};
	var _setY1 = function(y){
		_y1 = y;
		this.y1 = y;
		if(_height !== "" || this.height !== 0){
			this.y2 = this.y1 + this.height;
		} else if(_y2 !== "" || this.y2 !== 0){
			this.fixcoords();
			this.height = this.y2 - this.y2; }
		this.buildAliases(); };
	var _setY2 = function(y){
		_y2 = y;
		this.y2 = y;
		if(_height !== "" || this.height !== 0){
			this.y1 = this.y2 - this.height;
		} else if(_y1 !== "" || this.y1 !== 0){
			this.fixcoords();
			this.height = this.y2 - this.y1; }
		this.buildAliases(); };
	var _setHeight = function(h){
		_height = h;
		this.height = h;
		if(_y1 !== ""){
			this.y2 = this.y1 + this.height;
		} else if(_y2 !== ""){
			this.y1 = this.y2 - this.height; }};
	var _getX1Fun = function(){
		if(this.hasAlternative('_getx1')){
			return _getx1(this.element);
		} else { return (window.jQuery) ?  $(this.element).position().left : findElementStyle(this.element, 'offsetLeft'); }};
	var _getX2Fun = function(){
		if(this.hasAlternative('_getx2')){
			return _getx2(this.element);
		} else { return (window.jQuery) ? ($(this.element).position().left + parseFloat($(this.element).innerWidth())) : (findElementStyle(this.element, 'offsetLeft') + findElementStyle(this.element, 'offsetWidth')); }};
	var _getY1Fun = function(){
		if(this.hasAlternative('_gety1')){
			return _gety1(this.element);
		} else { return (window.jQuery) ? $(this.element).position().top : findElementStyle(this.element, 'offsetTop'); }};
	var _getY2Fun = function(){
		if(this.hasAlternative('_gety2')){
			return _gety2(this.element);
		} else { return (window.jQuery) ? ($(this.element).position().top + parseFloat($(this.element).innerHeight())): (findElementStyle(this.element, 'offsetTop') + findElementStyle(this.element, 'offsetHeight')); }};
	var _getWidthFun = function(){
		if(this.hasAlternative('_getwidth')){
			return _getwidth(this.element);
		} else { return (window.jQuery) ? parseFloat($(this.element).innerWidth()) : findElementStyle(this.element, 'offsetWidth'); }};
	var _getHeightFun = function(){
		if(this.hasAlternative('_getheight')){
			return _getheight(this.element);
		} else { return (window.jQuery) ? parseFloat($(this.element).innerHeight()) : findElementStyle(this.element, 'offsetHeight'); }};
	var _customGet = function(t, f){
		if(f !== undefined && typeof f === 'function'){
			var hasSet = true;
			switch(t){
				case 'x1': case 'left':
					_getx1 = f;
					break;
				case 'x2': case 'right':
					_getx2 = f;
					break;
				case 'y1': case 'top':
					_gety1 = f;
					break;
				case 'y2': case 'bottom':
					_gety2 = f;
					break;
				case 'width':
					_getwidth = f;
					break;
				case 'height':
					_getheight = f;
					break;
				default:
					hasSet = false;
					break; }
			return hasSet;
		} else { return false; }};
	var _hasAlternative = function(fun){ return (fun !== undefined && fun !== null && typeof fun === 'function') ? true : false; };

	this.get = _get;
	this.setX1 = _setX1;
	this.setX2 = _setX2;
	this.setWidth = _setWidth;
	this.setY1 = _setY1;
	this.setY2 = _setY2;
	this.setHeight = _setHeight;
	
	this.getX1 = _getX1Fun;
	this.getX2 = _getX2Fun;
	this.getY1 = _getY1Fun;
	this.getY2 = _getY2Fun;
	this.getWidth = _getWidthFun;
	this.getHeight = _getHeightFun;
	this.customGet = _customGet;
	this.hasAlternative = _hasAlternative;
	
	if(args !== undefined){ this.init(args); }
}

BoundaryCoordinates.prototype.init = function(args){
	var isHTML = (isHTMLElement !== undefined && args !== undefined && isHTMLElement(args)) ? true : false;
	if(isHTML){
		this.elementType = "HTML";
		this.method = "get";
		this.element = args;
		this.get();
	} else {
		if(typeof args === 'object'){
			if('element' in args && args.element !== undefined && isHTMLElement(args.element)){
				this.elementType = "HTML";
				this.method = 'get';
				this.element = args.element;
				this.get();
			} else {
				this.elementType = null;
				if('x1' in args){
					this.setX1(args['x1']);
				} else if('left' in args){ this.setLeft(args['left']); }
				if('x2' in args){
					this.setX2(args['x2']);
				} else if('right' in args){ this.setRight(args['right']); }
				
				if('y1' in args){
					this.setY1(args['y1']);
				} else if('top' in args){ this.setTop(args['top']); }
				if('y2' in args){
					this.setY1(args['y2']);
				} else if('bottom' in args){ this.setBottom(args['bottom']); }
				
				if('width' in args){ this.setWidth(args['width']); }
				if('height' in args){ this.setHeight(args['height']); }}}
			}
	this.buildAliases(); };

BoundaryCoordinates.prototype.buildAliases = function(){
	this.left = this.x1;
	this.right = this.x2;
	this.top = this.y1;
	this.bottom = this.y2; };
BoundaryCoordinates.prototype.fixcoords = function(){
	var d = 0;
	if(this.x1 > this.x2){
		d = this.x1;
		this.x1 = this.x2;
		this.x2 = d; }
	if(this.y1 > this.y2){
		d = this.y1;
		this.y1 = this.y2;
		this.y2 = d; }};
BoundaryCoordinates.prototype.setLeft = function(x){ this.setX1(x); };
BoundaryCoordinates.prototype.setRight = function(x){ this.setX2(x); };
BoundaryCoordinates.prototype.setTop = function(y){ this.setY1(y); };
BoundaryCoordinates.prototype.setBottom = function(y){ this.setY2(y); };
