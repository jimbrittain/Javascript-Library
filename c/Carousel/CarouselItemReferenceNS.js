"use strict";
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselItemReference' in adr)){
    adr.CarouselItemReference = function(id, elem, master){
        this.id = 0;
        this.element = null; 
        this.master = null;
        this.init(id, elem, master);
    };
    adr.CarouselItemReference.prototype.init = function(id, elem, master){
        var ut = __imns('util.tools');
        var obj = {
            id: 0,
            elem: null,
            master: null }, o = {};
        if(typeof id === 'object'){
            o = ut.handlePassedArguments(id, obj);
        } else {
            o.id = (id !== undefined) ? id : 0;
            o.elem = (elem !== undefined) ? elem : null;
            o.master = (master !== undefined) ? master : null; }
        if(o.id !== undefined){ this.setId(o.id); }
        if(o.elem !== undefined){ this.setElement(o.elem); }
        if(o.master !== undefined){ this.setMaster(o.master); }};
    adr.CarouselItemReference.prototype.setId = function(n){
        var uv = __imns('util.validation');
        this.id = (uv.isNumber(n) && n > -1 && Math.round(n) === n) ? n : this.id;
        return (this.id === n); };
    adr.CarouselItemReference.prototype.setElement = function(el){
        var uv = __imns('util.validation');
        this.element = (el !== null && uv.isHTMLElement(el)) ? el : this.element;
        return (this.element === el); };
    adr.CarouselItemReference.prototype.setMaster = function(m){
        var cc = __imns('component.classes');
        this.master = ('Carousel' in cc && m instanceof cc.Carousel) ? m : this.master;
        return (this.master === m); };
    adr.CarouselItemReference.prototype.update = function(){
        var changed = false;
        if(this.master !== null){
            var items = this.master.getItems(), found = false;
            for(var i=0, imax = items.length; i<imax; i+=1){
                if(items[i] === this.element){
                    found = true;
                    if(this.id !== i){ changed = true; }
                    this.id = i;
                    break; }}
            if(!found){ 
                changed = true;
                this.rescue(); }}
        return !changed; };
    adr.CarouselItemReference.prototype.rescue = function(){
        if(this.master !== null){
            this.element = this.master.getItems[0];
            this.id = 0; }};

}
