"use strict";
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselControlElement' in adr)){
    adr.CarouselControlElement = function(caro, element){
        var cc = __imns('component.classes');
        cc.CarouselControl.call(this, caro);
        this.initialised = false;
        this.active = true;
        this.element = null;
        if(this.constructor === cc.CarouselControlElement){ this.init(caro, element); }};
    adr.CarouselControlElement.prototype = Object.create(adr.CarouselControl.prototype);
    adr.CarouselControlElement.prototype.constructor = adr.CarouselControlElement;
    adr.CarouselControlElement.prototype.setElement = function(el){
        var uv = __imns('util.validation');
        this.element = (uv.isHTMLElement(el)) ? el : null; 
        this.initElement();
        return (this.element === el); };
    adr.CarouselControlElement.prototype.disableElement = function(){
        var ud = __imns('util.dom');
        if(this.active){
            this.active = false;
            ud.addClass(this.element, 'disabled');
            ud.setAttribute(this.element, 'aria-disabled', 'true');
            return true; }
        return false; };
    adr.CarouselControlElement.prototype.enableElement = function(){
        var ud = __imns('util.dom');
        if(!this.active){
            this.active = true;
            ud.removeClass(this.element, 'disabled');
            ud.setAttribute(this.element, 'aria-disabled', 'false'); 
            return true; }
        return false; };
    adr.CarouselControlElement.prototype.initElement = function(){
        var ud = __imns('util.dom');
        if(ud.hasAttribute(this.carousel.container)){
            ud.setAttribute(this.element, 'aria-disabled', 'false');
            ud.setAttribute(this.element, 'aria-controls', ud.getAttribute(this.carousel.container, 'id')); }
        return true; };
    adr.CarouselControlElement.prototype.isElementEnabled = function(){ 
        var ud = __imns('util.dom');
        return (ud.hasClass(this.element, 'disabled') || ud.getAttribute(this.element, 'aria-disabled') === 'true') ? false : true; };
    adr.CarouselControlElement.prototype.init = function(caro, element){
        var ut = __imns('util.tools'),
            cc = __imns('component.classes');
        cc.CarouselControl.prototype.init.call(this, caro);
        this.setElement(element); 
        if(this.element !== null){
            var c = this;
            ut.fetter(this.carousel.container, 'carouselTransitionStart', [this, function(){ c.disableElement(); }]);
            ut.fetter(this.carousel.container, 'carouselTransitionEnd', [this, function(){ c.enableElement(); }]);
        }
        this.initialised = true; };
    adr.CarouselControlElement.prototype.destroy = function(){
        if(this.element !== null && this.initialised){
            var ut = __imns('util.tools');
            var c = this;
            ut.unfetter(this.carousel.container, 'carouselTransitionStart', [this, function(){ c.disableElement(); }]);
            ut.unfetter(this.carousel.container, 'carouselTransitionEnd', [this, function(){ c.enableElement(); }]);
        }
    };
}
