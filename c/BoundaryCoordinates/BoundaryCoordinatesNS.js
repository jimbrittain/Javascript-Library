"use strict";
/* global window, $, __imns */
/*jshint -W069 */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('BoundaryCoordinates' in adr)){


    adr.BoundaryCoordinates = function(args){
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
            var ud = __imns('util.dom');
            if(this.hasAlternative('_getx1')){
                return _getx1(this.element);
            } else { return (window.jQuery) ?  $(this.element).position().left : ud.findElementStyle(this.element, 'offsetLeft'); }};
        var _getX2Fun = function(){
            var ud = __imns('util.dom');
            if(this.hasAlternative('_getx2')){
                return _getx2(this.element);
            } else { return (window.jQuery) ? ($(this.element).position().left + parseFloat($(this.element).innerWidth())) : (ud.findElementStyle(this.element, 'offsetLeft') + ud.findElementStyle(this.element, 'offsetWidth')); }};
        var _getY1Fun = function(){
            var ud = __imns('util.dom');
            if(this.hasAlternative('_gety1')){
                return _gety1(this.element);
            } else { return (window.jQuery) ? $(this.element).position().top : ud.findElementStyle(this.element, 'offsetTop'); }};
        var _getY2Fun = function(){
            var ud = __imns('util.dom');
            if(this.hasAlternative('_gety2')){
                return _gety2(this.element);
            } else { return (window.jQuery) ? ($(this.element).position().top + parseFloat($(this.element).innerHeight())): (ud.findElementStyle(this.element, 'offsetTop') + ud.findElementStyle(this.element, 'offsetHeight')); }};
        var _getWidthFun = function(){
            var ud = __imns('util.dom');
            if(this.hasAlternative('_getwidth')){
                return _getwidth(this.element);
            } else { return (window.jQuery) ? parseFloat($(this.element).innerWidth()) : ud.findElementStyle(this.element, 'offsetWidth'); }};
        var _getHeightFun = function(){
            var ud = __imns('util.dom');
            if(this.hasAlternative('_getheight')){
                return _getheight(this.element);
            } else { return (window.jQuery) ? parseFloat($(this.element).innerHeight()) : ud.findElementStyle(this.element, 'offsetHeight'); }};
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
        if(args !== undefined){ this.init(args); }};

    adr.BoundaryCoordinates.prototype.init = function(args){ 
        var uv = __imns('util.validation');
        var isHTML = (uv.isHTMLElement !== undefined && args !== undefined && uv.isHTMLElement(args)) ? true : false;
        if(isHTML){
            this.elementType = "HTML";
            this.method = "get";
            this.element = args;
            this.get();
        } else {
            if(typeof args === 'object'){
                if('element' in args && args.element !== undefined && uv.isHTMLElement(args.element)){
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

    adr.BoundaryCoordinates.prototype.buildAliases = function(){
        this.left = this.x1;
        this.right = this.x2;
        this.top = this.y1;
        this.bottom = this.y2; };
    adr.BoundaryCoordinates.prototype.fixcoords = function(){
        var d = 0;
        if(this.x1 > this.x2){
            d = this.x1;
            this.x1 = this.x2;
            this.x2 = d; }
        if(this.y1 > this.y2){
            d = this.y1;
            this.y1 = this.y2;
            this.y2 = d; }};
    adr.BoundaryCoordinates.prototype.setLeft = function(x){ this.setX1(x); };
    adr.BoundaryCoordinates.prototype.setRight = function(x){ this.setX2(x); };
    adr.BoundaryCoordinates.prototype.setTop = function(y){ this.setY1(y); };
    adr.BoundaryCoordinates.prototype.setBottom = function(y){ this.setY2(y); };
    adr.BoundaryCoordinates.prototype.isOver = function(co_x, co_y){
        var uc = __imns('util.classes');
        var co = null;
        if(co_x instanceof uc.BoundaryCoordinates){
            var b = co_x;
            return ((b.x1 >= this.x1 && b.x2 <= this.x2) && (b.y1 >= this.y1 && b.y2 <= this.y2)) ? true : false; 
        } else if(co_x instanceof uc.Coordinates){
            co = co_x;
        } else {
            var x = parseFloat(co_x);
            var y = (co_y !== undefined) ? parseFloat(co_y) : 0;
            co = new uc.Coordinates(x,y); }
        return ((co.x >= this.x1 && co.x <= this.x2) && (co.y >= this.y1 && co.y <= this.y2)) ? true : false; };
    adr.BoundaryCoordinates.prototype.isOverlap = function(co_x, co_y){
        var uc = __imns('util.classes');
        if(co_x instanceof uc.BoundaryCoordinates){
            var b = co_x,
                over = false;
            over = (!over && this.isOver(new uc.Coordinates(b.x1, b.y1))) ? true : over;
            over = (!over && this.isOver(new uc.Coordinates(b.x2, b.y1))) ? true : over;
            over = (!over && this.isOver(new uc.Coordinates(b.x1, b.y2))) ? true : over;
            over = (!over && this.isOver(new uc.Coordinates(b.x2, b.y2))) ? true : over;
            over = (!over && this.isOver(b)) ? true : over;
            over = (!over && b.isOver(this)) ? true : over;
            return over;
        } else {
            return this.isOver(co_x, co_y); }};


}
