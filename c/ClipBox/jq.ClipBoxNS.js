"use strict";
/* global window, jquery, $, console, __imns */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ClipBox' in adr)){


    /* notes convertToPixelNumber -> measure and whatmeasure */
    /*
     * jq.Clipper.js
     * ClipBox Class - Version 0.1
     * @version 0.1
     * @author JDB - jim@immaturedawn.co.uk 2013
     * @url - http://www.immaturedawn.co.uk
     * @license - Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
     * @copyright - Immature Dawn 2013
     *
     * Dependencies
     * 		calculateAngledDistance
     * 		simplifyDegrees
     * 		isHTMLElement
     * 		convertToPixelNumber
     * 		JQuery
     *
     * To create supply args
     * 	If HTMLElement - uses defaults for all else;
     * 	If String - trys to use string as JQ selector, if good uses defaults for all else;
     * 	If Object
     * 		'element' 				: the target element;
     * 		'constrainParent'		: Also constrain the parent
     * 		'angle'					: between 0 and 360
     * 		'direction'				: 'ttb', 'bbt', 'rtl', 'ltr'
     * 		'determineInnerX', 'determineInnerY', 'determineOuterX', 'determineOuterY' : option for supplying a more complicated calculator function
    */
    adr.ClipBox = function(args){
        var uc = __imns('util.classes'), 
            udb = __imns('util.debug');
        this.element = null;
        this.container = null;
        this.angle = 90;
        this.constrainParent = true;
        this._determineInnerWidth = null;
        this._determineInnerHeight = null;
        this._determineOuterWidth = null;
        this._determineOuterHeight = null;
        this.outer = { 'width' : 0, 'height' : 0 };
        this.inner = { 'width' : 0, 'height' : 0 };
        this.working = new uc.CoordinatesBox();
        var isGood = this.init(args);
        if(isGood){
            $(this.element).css('visibility', 'visible');
            return this;
        } else {
            (new udb.IMDebugger()).pass("Unable to initialise ClipBox");
            return false; }};

    adr.ClipBox.prototype.init = function(obj){
        var uv = __imns('util.validation'),
            ut = __imns('util.tools');
        if(uv.isHTMLElement(obj)){
            this.element = this.checkElement(obj);
        } else if(typeof obj === 'object'){
            if('direction' in obj){
                switch(obj.direction){
                    case 'ttb': this.angle = 0; break;
                    case 'bbt': this.angle = 180; break;
                    case 'rtl': this.angle = 270; break;
                    case 'ltr':
                    case 'default':
                        this.angle = 90;
                        break; }
            } else if('angle' in obj && !(isNaN(parseFloat(obj.angle))) && isFinite(obj.angle)){ 
                this.angle = ut.simplifyDegrees(obj.angle); }
            this.constrainParent = ('constrainParent' in obj && obj.constrainParent) ? true : false;
            this.element = ('element' in obj && uv.isHTMLElement(obj.element)) ? this.checkElement(obj.element) : null;
            this.container = ('container' in obj && uv.isHTMLElement(obj.container)) ? obj.container : null;
            this._determineInnerWidth = ('determineInnerWidth' in obj && (typeof obj.determineInnerWidth === 'function')) ? obj.determineInnerWidth : null;
            this._determineInnerHeight = ('determineInnerHeight' in obj && (typeof obj.determineInnerHeight === 'function')) ? obj.determineInnerHeight : null;
            this._determineOuterWidth = ('determineOuterWidth' in obj && (typeof obj.determineOuterWidth === 'function')) ? obj.determineOuterWidth : null;
            this._determineOuterHeight = ('determineOuterHeight' in obj && (typeof obj.determineOuterHeight === 'function')) ? obj.determineOuterHeight : null;
        } else if(typeof obj === 'string'){
            var jqList = $(obj);
            if(jqList.length > 0 && (uv.isHTMLElement(jqList[0]))){ this.element = this.checkElement(jqList[0]); }}
        if(this.element !== null){
            this.container = (this.container === null) ? $(this.element).parent()[0] : this.container;
            this.determineInnerWidth();
            this.determineInnerHeight();
            this.determineOuterWidth();
            this.determineOuterHeight();
            return true;
        } else { return false; }};

    adr.ClipBox.prototype.initialised = function(){
            return (this.outer.width === 0 || this.outer.height === 0 || this.inner.width === 0 || this.inner.height === 0) ? false : true; };

    adr.ClipBox.prototype.move = function(distance){
        var ut = __imns('util.tools');
        distance = ut.convertToPixelNumber(distance);
        var obj = {
            'left' : 	ut.convertToPixelNumber($(this.element).css('left')),
            'top' : 	ut.convertToPixelNumber($(this.element).css('top'))};
        var change = ut.calculateAngledDistance(this.angle, distance);
        obj.left += change.x;
        obj.top += change.y;
        this.reposition(obj); };

    adr.ClipBox.prototype.determine = function(){
        if(this.initialised()){
            var ut = __imns('util.tools'),
                uc = __imns('util.classes');
            this.working = new uc.CoordinatesBox();
            var args = {
                'top' :     ut.convertToPixelNumber($(this.element).css('top')),
                'right' :   ut.convertToPixelNumber($(this.element).css('right')),
                'bottom' :  ut.convertToPixelNumber($(this.element).css('bottom')),
                'left' :    ut.convertToPixelNumber($(this.element).css('left'))
            };
            var obj = {
                'top' : 	args.top,
                'left' : 	args.left };
            this.reposition(obj); }};

    adr.ClipBox.prototype.reposition = function(args){
        if(this.initialised()){
            var ut = __imns('util.tools'),
                uc = __imns('util.classes');
            this.working = new uc.CoordinatesBox();
            this.working.x2 = this.outer.width;
            this.working.y2 = this.outer.height;
            var obj = { 'top' : 0, 'left' : 0 };
            if($.isArray(args)){
                var beenConverted = false;
                var argsReplacement = {};
                if(args.length === 4){ 
                    argsReplacement = {
                        'top':		ut.convertToPixelNumber(args[0]),
                        'right':	ut.convertToPixelNumber(args[1]),
                        'bottom':	ut.convertToPixelNumber(args[2]),
                        'left':		ut.convertToPixelNumber(args[3]) };
                } else if((args.length % 2) === 0 && (args.length < 9)){
                    var i = 0;
                    while(i < args.length){
                        var p = args[i];
                        var v = ut.convertToPixelNumber(args[i + 1]);
                        argsReplacement[p] = v;
                        i += 1; }}
                args = argsReplacement; }
            if(typeof args === 'object'){
                if('right' in args){ obj.left -= ut.convertToPixelNumber(args.right); }
                if('left' in args){ obj.left += ut.convertToPixelNumber(args.left); }
                if('bottom' in args){ obj.top -= ut.convertToPixelNumber(args.bottom); }
                if('top' in args){ obj.top += ut.convertToPixelNumber(args.top); }}
            this.setVertical(obj.top);
            this.setHorizontal(obj.left);
            this.setClip();
            this.setXY();
            return true;
        } else {
            var udb = __imns('util.debug');
            (new udb.IMDebugger()).pass("ClipBox is not properly initialised. Aborting");
            return false; }};

    adr.ClipBox.prototype.setHorizontal = function(xPos){
        this.working.x1 = xPos;
        if(this.inner.width < this.outer.width){
            this.working.x1 = 0;
            this.working.x2 = this.inner.width;
        } else {
            this.working.x2 = this.working.x1 + this.inner.width;
            if(this.working.x2 < this.outer.width){
                this.working.x2 = this.outer.width;
                this.working.x1 = this.working.x2 - this.inner.width;
            } else if(this.working.x1 > 0){
                this.working.x1 = 0;
                this.working.x2 = this.working.x1 + this.inner.width; }}
        if(this.working.x1 < 0){
            this.working.x = this.working.x1;
            this.working.x1 = Math.abs(this.working.x1);
            this.working.x2 += this.working.x1; }};

    adr.ClipBox.prototype.setVertical = function(yPos){
        this.working.y1 = yPos;
        if(this.inner.height < this.outer.height){
            this.working.y1 = 0;
            this.working.y2 = this.inner.height;
        } else {
            this.working.y2 = this.working.y1 + this.inner.height;
            if(this.working.y2 < this.outer.height){
                this.working.y2 = this.outer.height;
                this.working.y1 = this.working.y2 - this.inner.height;
            } else if(this.working.y1 > 0){
                this.working.y1 = 0;
                this.working.y2 = this.working.y1 + this.inner.height; }}
        if(this.working.y1 < 0){
            this.working.y = this.working.y1;
            this.working.y1 = Math.abs(this.working.y1);
            this.working.y2 += this.working.y1; }};

    adr.ClipBox.prototype.checkElement = function(elem){
        var isParentPositioned = ($(elem).parent().css('position') === 'relative' || $(elem).parent().css('position') === 'absolute') ? true : false;
        var isElementPositioned = ($(elem).css('position') === 'absolute' || $(elem).css('position') === 'relative') ? true : false;
        var isElementHidden = ($(elem).css('visibility') === 'hidden') ? true : false;
        return (isParentPositioned && isElementPositioned && isElementHidden) ? elem : null; };

    adr.ClipBox.prototype.parseClip = function(){
        var theClip = $(this.element).css('clip');
        var obj = {'top': 0, 'right': 0, 'bottom' : 0, 'left' : 0 };
        var ut = __imns('util.tools');
        if(theClip.indexOf('rect(') === 0){
            theClip = theClip.substring(5);
            theClip = theClip.substring(0, (theClip.length - 1));
            var clip_arr = [];
            if(theClip.indexOf(', ') !== -1){ clip_arr = theClip.split(', ');
            } else if(theClip.indexOf(',') !== -1){ clip_arr = theClip.split(',');
            } else if(theClip.indexOf(' ') !== -1){ clip_arr = theClip.split(' '); }
            if(clip_arr.length === 4){
                obj.top = ut.convertToPixelNumber(clip_arr[0]);
                obj.right = ut.convertToPixelNumber(clip_arr[1]);
                obj.bottom = ut.convertToPixelNumber(clip_arr[2]);
                obj.left = ut.convertToPixelNumber(clip_arr[3]); }}
        return obj; };

    adr.ClipBox.prototype.determineOuterWidth = function(){
        var ut = __imns('util.tools');
        this.outer.width = (typeof this._determineOuterWidth === 'function') ? ut.convertToPixelNumber(this._determineOuterWidth()) : ut.convertToPixelNumber($(this.container).innerWidth()); };

    adr.ClipBox.prototype.determineOuterHeight = function(){
        var ut = __imns('util.tools');
        this.outer.height = (typeof this._determineOuterHeight === 'function') ? ut.convertToPixelNumber(this._determineOuterHeight()) : ut.convertToPixelNumber($(this.container).innerHeight()); };

    adr.ClipBox.prototype.determineInnerWidth = function(){
        var ut = __imns('util.tools');
        this.inner.width = (typeof this._determineInnerWidth === 'function') ? ut.convertToPixelNumber(this._determineInnerWidth()) : ut.convertToPixelNumber($(this.element).outerWidth()); };

    adr.ClipBox.prototype.determineInnerHeight = function(){
        var ut = __imns('util.tools');
        this.inner.height = (typeof this._determineInnerHeight === 'function') ? ut.convertToPixelNumber(this._determineInnerHeight()) : ut.convertToPixelNumber($(this.element).outerHeight()); };

    adr.ClipBox.prototype.handleValue = function(val){ return (val === 0) ? 'auto' : val + 'px'; };

    adr.ClipBox.prototype.setClip = function(){
        $(this.element).css('clip', 'rect(' + this.handleValue(this.working.y1) + ' ' + this.handleValue(this.working.x2) + ' ' + this.handleValue(this.working.y2) + ' ' + this.handleValue(this.working.x1) + ')');
        if(this.constrainParent){
            $(this.element).parent().css('width', (this.working.x2 - this.working.x1) + 'px');
            $(this.element).parent().css('height', (this.working.y2 - this.working.y1) + 'px'); }};

    adr.ClipBox.prototype.setXY = function(){
        var xShift = this.working.x;
        var yShift = this.working.y;
        if($(this.element).css('left') !== this.handleValue(xShift)){ $(this.element).css('left', this.handleValue(xShift)); }
        if($(this.element).css('top') !== this.handleValue(yShift)){ $(this.element).css('top', this.handleValue(yShift)); }};

    adr.CoordinatesBox = function(){
        this.x1 = 0;
        this.x2 = 0;
        this.y1 = 0;
        this.y2 = 0;
        this.requiresAlteration = false;
        this.x = 0;
        this.y = 0; };


}
