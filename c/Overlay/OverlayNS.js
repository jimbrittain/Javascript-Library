"use strict";
/*jshint -W069 */
/* global setInterval, clearInterval, document, console, __imns */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('Overlay' in adr)){

    adr.Overlay = function(elem){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes');
        if(cc.Overlay.prototype.singleton !== undefined){
            return (elem !== undefined) ? cc.Overlay.prototype.singleton.init(elem) : cc.Overlay.prototype.singleton; }
        cc.Overlay.prototype.singleton = this;
        this.initiated = false;
        this.active = true;
        this.element = "";
        this.ovOpen = false;
        this._isOpen = null;
        this._isClosed = null;
        this._open = null;
        this._close = null;
        this.animation = new uc.Animation();
        if(elem !== undefined){ this.init(elem); }};
    adr.Overlay.prototype.addStartFunction= function(f){
        if(f !== undefined && typeof f === 'function'){ 
            this._open = f;
            return true; }
        return false; };
    adr.Overlay.prototype.addCloseFunction= function(f){
        if(f !== undefined && typeof f === 'function'){ 
            this._close = f;
            return true; }
        return false; };
    adr.Overlay.prototype.resetDefaults = function(){
        this._isOpen = null;
        this._isClosed = null;
        this.ovOpen = false;
        this._open = null;
        this._close = null; };
    adr.Overlay.prototype.init = function(elem){
        var uv = __imns('util.validation');
        this.element = (elem !== null && uv.isHTMLElement(elem)) ? elem : null;
        this.parentElement = (this.element.parentElement) ? this.element.parentElement : ((this.element.parentNode) ? this.element.parentNode : null);
        this.resetDefaults();
        if(this.element !== null){
            this.initiated = true;
            if(!this.hasCloseButton()){ this.buildCloseButton(); }}
        return this; };
    adr.Overlay.prototype.setActive = function(boo){ this.active = ((boo === undefined || boo) && this.element !== null) ? true : false; };
    adr.Overlay.prototype.setIsOpen = function(f){ 
        if(f !== undefined && typeof f === 'function'){
            this._isOpen = f;
            return true; }
        return false; };
    adr.Overlay.prototype.isOpen = function(){ return (this._isOpen !== null && typeof this._isOpen === 'function') ? this._isOpen() : this.ovOpen; };
    adr.Overlay.prototype.setIsClosed = function(f){ 
        if(f !== undefined && typeof f === 'function'){ 
            this._isClosed = f;
            return true; }
        return false; };
    adr.Overlay.prototype.isClosed = function(){
        if(this._isClosed !== null && typeof this._isClosed === 'function'){
            return this._isClosed();
        } else if(this._isOpen !== null && typeof this._isOpen === 'function'){
            return (this._isOpen()) ? false : true;
        } else { return (!(this.ovOpen)); }};
    adr.Overlay.prototype.toggle = function(){ return (this.isOpen()) ? this.close() : this.open(); };
    adr.Overlay.prototype.open = function(){
        var uc = __imns('util.classes');
        if(this.active && this.initiated){
            if(this._open!== null && typeof this._open === 'function'){ this._open(); }
            this.ovOpen = true;
            return true; }
        return false; };
    adr.Overlay.prototype.close = function(){
        var uc = __imns('util.classes');
        if(this.active && this.initiated){
           if(this._close !== null && typeof this._close === 'function'){ this._function(); }
           this.ovOpen = false;
            return true; }
        return false; };
    adr.Overlay.prototype.hasCloseButton = function(){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(this.initiated && this.element !== null && uv.isHTMLElement(this.element)){
            var e = ud.findElementById('overclose');
            //should check that overclose is inside element;
            return (e !== null && e !== undefined && uv.isHTMLElement(e)) ? true : false; }
        return false; };
    adr.Overlay.prototype.buildCloseButton = function(){
        var uv = __imns('util.validation'),
            ut = __imns('util.tools'),
            ud = __imns('util.dom');
        if(this.initiated && !this.hasCloseButton()){
            if(this.element !== null && uv.isHTMLElement(this.element)){
                if('innerHTML' in this.element){
                    this.element.innerHTML = this.element.innerHTML + '<a id="overclose">&#215;</a>';
                } else {
                    if('createElement' in document && 'appendChild' in this.element){
                        var e = document.createElement('a');
                        e.setAttribute('id', 'overclose');
                        this.element.appendChild(e); }}}}
        var n = ud.findElementByID('overclose');
        if(n !== undefined && uv.isHTMLElement(n)){
            var c = this;
            ut.fetter(n, 'click', [c, function(e){ c.toggle(); ut.preventEvent(e); }], false); 
            ut.fetter(n, 'touchstart', [c, function(e){ c.toggle(); ut.preventEvent(e); }], false);
            return true; }
        return false; };
}
