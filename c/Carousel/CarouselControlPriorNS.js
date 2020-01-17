"use strict";
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselControlPrior' in adr)){
    adr.CarouselControlPrior = function(caro, element){ //extends control
        var cc = __imns('component.classes');
        this.settings = {
            click: true,
            hover: false };
        cc.CarouselControlElement.call(this, caro, element);
        if(this.constructor === cc.CarouselControlPrior){ this.init(caro, element); }};
    adr.CarouselControlPrior.prototype = Object.create(adr.CarouselControlElement.prototype);
    adr.CarouselControlPrior.prototype.constructor = adr.CarouselControlPrior;
    adr.CarouselControlPrior.prototype.init = function(caro, element){
        var ut = __imns('util.tools'),
            uv = __imns('util.validation'),
            cc = __imns('component.classes');
        cc.CarouselControlElement.prototype.init.call(this, caro, element);
        var c = this;
        if(this.element !== null){
            if(this.settings.click){
                ut.fetter(this.element, 'click', [this, function(){ if(c.isElementEnabled()){ return c.prior(); }}], true);
                ut.fetter(this.element, 'touchdown', [this, function(){ if(c.isElementEnabled()){ return c.prior(); }}], true); }
            if(this.settings.hover){
                ut.fetter(this.element, 'mouseenter', [this, function(){ if(c.isElementEnabled()){ return c.prior(); }}], true); }
            ut.fetter(this.carousel.container, 'keydown', [this, function(e){ if(c.isElementEnabled()){ return c.priorKeys(e); }}], true);
            ut.fetter(this.carousel.container, 'carouselReachedFirst', [this, function(){ c.disableElement(); }]);
            ut.fetter(this.carousel.container, 'carouselInactive', [this, function(){ c.disableElement(); }]);
            //add a deactivate on Not active:CarouselEvent
            //add a touchdrag
            this.initialised = true;
            if(this.carousel.isAtFirst() || !this.carousel.active){ this.disableElement(); }
            return true; }
        return false; };
    adr.CarouselControlPrior.prototype.destroy = function(){
        var ut = __imns('util.tools');
        var c = this;
        if(this.initialised && this.element !== null){
            if(this.settings.click){
                ut.unfetter(this.element, 'click', [this, function(){ c.prior(); }]);
                ut.unfetter(this.element, 'touchdown', [this, function(){ c.prior(); }]); }
            if(this.settings.hover){
                ut.unfetter(this.element, 'mouseenter', [this, function(){ c.prior(); }]); }
            ut.unfetter(this.carousel.container, 'keypress', [this, function(e){
                var k = (__imns('util.tools')).findEventKey(e);
                if(k === 'ArrowLeft' || k === '37'){
                    c.prior();
                    ut.preventEvent(e);
                    return false; }
                return true; }], true);
            ut.unfetter(this.carousel.container, 'carouselReachedLast', [this, function(){ c.disableElement();  }], true);
            ut.unfetter(this.carousel.container, 'carouselTransitionStart', [this, function(){ c.disableElement(); }], true);
            ut.unfetter(this.carousel.container, 'carouselTransitionEnd', [this, function(){ c.enableElement(); }], true);
            //ut.fetter(this.carousel.container, 'carouselSlide', [this, function(){ }], true); //atLast
            //remove not active
            //remove touchdrag
            this.initialised = false;
            return true; }
        return false; };
}
