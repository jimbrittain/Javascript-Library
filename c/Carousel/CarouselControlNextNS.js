"use strict";
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselControlNext' in adr)){
    adr.CarouselControlNext = function(caro, element){ //extends control
        var cc = __imns('component.classes');
        this.settings = {
            click: true,
            hover: false };
        cc.CarouselControl.call(this, caro);
        cc.CarouselControlElement.call(this, caro, element); 
        if(this.constructor === cc.CarouselControlNext){ this.init(caro, element); }};
    adr.CarouselControlNext.prototype = Object.create(adr.CarouselControlElement.prototype);
    adr.CarouselControlNext.prototype.constructor = adr.CarouselControlNext;
    adr.CarouselControlNext.prototype.init = function(caro, element){
        var cc = __imns('component.classes'),
            ut = __imns('util.tools');
        cc.CarouselControlElement.prototype.init.call(this, caro, element);
        var c = this;
        if(this.element !== null){
            if(this.settings.click){
                ut.fetter(this.element, 'click', [this, function(){ if(c.isElementEnabled()){ return c.next(); }}], true);
                ut.fetter(this.element, 'touchdown', [this, function(){ if(c.isElementEnabled()){ return c.next(); }}], true); }
            if(this.settings.hover){
                ut.fetter(this.element, 'mouseenter', [this, function(){ if(c.isElementEnabled()){ return c.next(); }}], true); }
            ut.fetter(this.carousel.container, 'keydown', [this, function(e){ if(c.isElementEnabled()){ return c.nextKeys(e); }}], true);
            ut.fetter(this.carousel.container, 'carouselReachedLast', [this, function(){ c.disableElement(); }]);
            ut.fetter(this.carousel.container, 'carouselSetInactive', [this, function(){ c.disableElement(); }]);
            ut.fetter(this.carousel.container, 'carouselSetActive', [this, function(){ c.enableElement(); }]);
            //add a touchdrag
            if(this.carousel.isAtLast() || !this.carousel.active){ this.disableElement(); }
            if(this.constructor === cc.CarouselControlNext){ this.initialised = true; }
            return true; }
        return false; };
    adr.CarouselControlNext.prototype.destroy = function(){
        if(this.initialised && this.element !== null){
            //remove click/hover
            //remove document key listen ->
            //remove atlast
            //remove not active
            //remove touchdrag
            this.initialised = false;
            return true; }
        return false; };
}
