"use strict";
/* global window, IMDebugger, $, __imns, document, console */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CarouselControlGoto' in adr)){
    adr.CarouselControlGoto = function(caro, element, number){ //extends control
        var cc = __imns('component.classes');
        this.element = null;
        this.initialised = false;
        this.relatedElement = null;
        this.relatedId = 0;
        cc.CarouselControl.call(this, caro);
        cc.CarouselControlElement.call(this, caro, element);
        if(this.constructor === cc.CarouselControlGoto){ this.init(caro, element, number); }};
    adr.CarouselControlGoto.prototype = Object.create(adr.CarouselControlElement.prototype);
    adr.CarouselControlGoto.prototype.constructor = adr.CarouselControlGoto;
    adr.CarouselControlGoto.prototype.setElement = function(el){
        var uv = __imns('util.validation');
        this.element = (uv.isHTMLElement(el)) ? el : null;
        return (this.element === el); };
    adr.CarouselControlGoto.prototype.createRelationship = function(number){
        var uv = __imns('util.validation');
        this.relatedId = (uv.isNumber(number) && number > 0 && Math.round(number) === number) ? number : -1;
        if(this.relatedId !== -1){
            this.relatedElement = this.carousel.getItems()[this.relatedId];
        }
    };
    adr.CarouselControlGoto.prototype.updateRelationship = function(){
        var elemId = this.carousel.findItemId(this.relatedElement);
        if(elemId !== this.relatedId){ this.relatedId = elemId; } };
    adr.CarouselControlGoto.prototype.init = function(caro, element, number){
        var cc = __imns('component.classes'),
            uc = __imns('util.classes'),
            uv = __imns('util.validation'),
            ut = __imns('util.tools');
        cc.CarouselControlElement.prototype.init.call(this, caro, element);
        if(this.element !== null){
            this.createRelationship(number);
            //set click/hover (useelementr choice on initiation);
            //set document key listen -> but add a focus for it;
            var h = new uc.HistoricKeyStrokes(),
                c = this;
            ut.fetter(document, 'keypresssequence', [this, function(e){ c.checkKeys(e); }], true);
            ut.fetter(this.carousel.container, 'carouselReceivedPrior', [this, function(){ c.updateRelationship(); }], true);
            //add a deactivate at transition:on
            //add a activate on transition:off
            //add a deactivate on Not active:CarouselEvent
            this.initialised = true;
            return true; }
        return false; };
    adr.CarouselControlGoto.prototype.checkKeys = function(e){
        var ut = __imns('util.tools');
        e = ut.findEvent(e);
        var d = ut.getEventDetails(e);
        if(typeof d === 'object' && 'keys' in d && ut.getActiveElement() === this.carousel.container){
            if(ut.matchAgainstHistoricKeyStrokes(this.relatedId, d.keys)){
                if(this.relatedElement === this.carousel.getItems()[this.relatedId]){
                    this.carousel.goto(this.relatedId); }}}};
    adr.CarouselControlGoto.prototype.destroy = function(){
        if(this.initialised && this.element !== null){
            //remove click/hover
            //remove document key listen ->
            //remove deactive on at transition:on
            //remove active
            this.initialised = false;
            return true; }
        return false; };
}
