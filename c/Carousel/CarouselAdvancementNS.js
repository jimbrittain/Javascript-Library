"use strict";
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselAdvancement' in adr)){
    adr.CarouselAdvancement = function(_next, _prior){
        this.next = 1;
        this.prior = 1;
        this.init(_next, _prior); };
    adr.CarouselAdvancement.prototype.init = function(_next, _prior){
        var uv = __imns('util.validation');
        if(_prior === undefined){
            if(uv.isArray(_next)){
                _prior = (_next[1] !== undefined) ? _next[1] : _prior;
                _next = (_next[0] !== undefined) ? _next[0] : _prior;
            } else if(typeof _next === 'object'){
                _prior = ('prior' in _next) ? _next.prior : _prior;
                _next = ('next' in _next) ? _next.next : _next; }}
        _prior = (_prior === undefined) ? _next : _prior;
        this.setNext(_next);
        this.setPrior(_prior); };
    adr.CarouselAdvancement.prototype.setNext = function(n){ 
        var uv = __imns('util.validation');
        n = (typeof n === 'string') ? Number(n) : n;
        this.next = (uv.isNumber(n) && n >= 1) ? Math.round(n) : 1; };
    adr.CarouselAdvancement.prototype.setPrior = function(n){ 
        var uv = __imns('util.validation');
        n = (typeof n === 'string') ? Number(n) : n;
        this.prior = (uv.isNumber(n) && n >= 1) ? Math.round(n) : 1; };
}
