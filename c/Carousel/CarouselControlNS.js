"use strict";
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselControl' in adr)){
    adr.CarouselControl = function(caro){
        var cc = __imns('component.classes');
        this.carousel = null;
        this.actions = [];
        if(this.constructor === cc.CarouselControl){ this.init(caro); }
    };
    adr.CarouselControl.prototype.init = function(caro){ 
        this.setCarousel(caro);
        this.initialised = true;
        return (caro === this.carousel); };
    adr.CarouselControl.prototype.setCarousel = function(caro){ 
        var cc = __imns('component.classes');
        this.carousel = (caro instanceof cc.Carousel) ? caro : null; };
    adr.CarouselControl.prototype.findActions = function(action, label, func){
        var arr = [];
        for(var i=0, imax = this.actions.length; i<imax; i+=1){
            var isa = true,
                ona = this.actions[i];
            if(action !== undefined){
                isa = (ona.action === action) ? isa : false; }
            if(isa && label === undefined){
                isa = (ona.label === label) ? isa : false; }
            if(isa && func === undefined){
                isa = (ona.func === func) ? isa : false; }
            if(isa){ arr.push(ona); } }
        return arr; };
    adr.CarouselControl.prototype.findAction = function(action, label, func){
        var a = this.findActions(action, label, func);
        return (a.length === 0 || a.length > 1) ? false : a[0]; };
    adr.CarouselControl.prototype.removeAction = function(action, label, func){
        var ut = __imns('util.tools');
        var a = this.findActions(action, label, func);
        for(var i=0, imax=a.length; i<imax; i+=1){
            ut.unfetter(this.carousel.container, a[i].action, [a[i].label, a[i].func]); }
    };
    adr.CarouselControl.prototype.setAction = function(action, func, label){
        var cc = __imns('component.classes');
        var act = this.findAction(action, label, func);
        if(!act){ 
            act = new cc.CarouselControlAction(action, func, label); 
            if(act.valid){ this.actions.push(act); }}
        if(act.valid){
            var ut = __imns('util.tools');
            var c = this;
            ut.fetter(this.carousel.container, [act, function(e){
                var data = ut.getEventDetails(e);
                if(this.carousel === data.carousel){ act.func(data); }
            }], true);
            return true; }
        return false; };
    adr.CarouselControl.prototype.priorKeys = function(e){
        var uv = __imns('util.validation'),
            ut = __imns('util.tools');
        var k = ut.findEventKey(e);
        if(uv.isInArray(this.carousel.directionKeys(false), k)){
            return this.prior(); }
        return true; };
    adr.CarouselControl.prototype.prior = function(){
        this.carousel.prior();
        (__imns('util.tools')).preventEvent();
        return false; };
    adr.CarouselControl.prototype.nextKeys = function(e){
        var uv = __imns('util.validation'),
            ut = __imns('util.tools');
        var k = ut.findEventKey(e);
        if(uv.isInArray(this.carousel.directionKeys(true), k)){
            return this.next(); }
        return true; };
    adr.CarouselControl.prototype.next = function(){
        this.carousel.next();
        (__imns('util.tools')).preventEvent();
        return false; };
    adr.CarouselControl.prototype.goto = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > -1 && Math.round(n) === n){
            this.carousel.goto(n);
            (__imns('util.tools')).preventEvent();
            return false;
        } else { return true; }};
    adr.CarouselControl.prototype.advance = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > -1 && Math.round(n) === n){
            this.carousel.advance(n);
            (__imns('util.tools')).preventEvent();
            return false; }
        return true; };
    adr.CarouselControl.prototype.behind = function(n){
        var uv = __imns('util.validation');
        if(uv.isNumber(n) && n > -1 && Math.round(n) === n){
            this.carousel.retreat(n);
            (__imns('util.tools')).preventEvent();
            return false; }
        return true; };
}
