"use strict";
/*global window, screen, Image, __imns */
/*jshint -W069 */ // Turn off dot notation
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('FixedPixelElements' in adr)){


    /**
     * @class FixedPixelElements
     * @module FixedPixelElements
     * @requires isHTMLElement, isNumber, debounce, fetter
     * @constructor
     * @type Singleton
     */
    adr.FixedPixelElements = function(){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        if(cc.FixedPixelElements.prototype.singleton !== undefined){ return cc.FixedPixelElements.prototype.singleton; }
        cc.FixedPixelElements.prototype.singleton = this;
        this.initiated = false;
        this.naturaldpi = 96;
        this.zoom_compensate = false;
        this.parts = []; 
        var c = this;
        this.init();
        ut.fetter(window, 'load', [c, c.process], true); };
    /**
     * FixedPixelElements.init
     * @method init
     * @requires fetter, debounce
     * @needs FixedPixelElements.process, FixedPixelElements.getDPI
     * @param {}
     * @return {}
     */
    adr.FixedPixelElements.prototype.init = function(){
        var ut = __imns('util.tools');
        this.initiated = true;
        this.dpi = this.getDPI(); 
        var c = this;
        ut.fetter(window, 'resize', [c, function(){ ut.debounce(function(){ c.process(); }, 500); }], true); };
    /**
     * FixedPixelElements.getDPI
     * @method getDPI
     * @requires isNumber
     */
    adr.FixedPixelElements.prototype.getDPI = function(){
        var uv = __imns('util.validation');
        if('devicePixelRatio' in window && uv.isNumber(window.devicePixelRatio)){
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
    adr.FixedPixelElements.prototype.add = function(elem){
        var uv = __imns('util.validation'),
            cc = __imns('component.classes');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            var o = this.findIndex(elem);
            if(o !== -1){
                return this.parts[o];
            } else {
                o = this.parts.length;
                this.parts.push(new cc.FixedPixelElement(elem));
                return this.parts[o]; }
        } else { return undefined; }};
    /**
     * FixedPixelElements.findIndex
     * @method findIndex
     * @requires isHTMLElement
     * @param {HTMLElement} elem
     * @return {Number} index of element or -1 for not found
     */
    adr.FixedPixelElements.prototype.findIndex = function(elem){
        var uv = __imns('util.validation');
        if(elem !== undefined && uv.isHTMLElement(elem)){
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
    adr.FixedPixelElements.prototype.process = function(){ for(var i=0, max = this.parts.length; i < max; i += 1){ this.parts[i].process();}};
    /**
     * @module FixedPixelElement
     * @submodule FixedPixelElement
     * @constructor
     * @requires isHTMLElement
     * @param {HTMLElement} elem
     */
    adr.FixedPixelElement = function(elem){
        var cc = __imns('component.classes');
        this.master = new cc.FixedPixelElements();
        this.element = null;
        this.naturalWidth = 0;
        this.naturalHeight = 0; 
        this.init(elem); };
    /**
     * FixedPixelElement.init
     * @method init
     * @param {Object} elem
     * @return {}
     */
    adr.FixedPixelElement.prototype.init = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(elem !== undefined && uv.isHTMLElement(elem)){
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
                    this.naturalWidth = ud.findElementStyle(elem, 'offsetWidth');
                    this.naturalHeight = ud.findElementStyle(elem, 'offsetHeight'); }}
            this.process(); }};
    /**
     * FixedPixelElement.process
     * @method process
     * @param {}
     * @return {}
     */
    adr.FixedPixelElement.prototype.process = function(){
        var uv = __imns('util.validation');
        if(this.element !== undefined && uv.isHTMLElement(this.element)){
            this.element.style['width'] = this.naturalWidth/(this.master.dpi/this.master.naturaldpi) + 'px';
            this.element.style['height'] = this.naturalHeight/(this.master.dpi/this.master.naturaldpi) + 'px'; }};


}
