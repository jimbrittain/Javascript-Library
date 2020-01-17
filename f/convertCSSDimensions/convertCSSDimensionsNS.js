"use strict";
/* global __imns, Number */
var adr = __imns('util.classes'),
    ut = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('CSSDimensions' in adr)){
    adr.CSSDimensions = function(){
        var uc = __imns('util.classes');
        if(uc.CSSDimensions.prototype.singleton !== undefined){
            return uc.CSSDimensions.prototype.singleton;
        }
        uc.CSSDimensions.prototype.singleton = this; };
    adr.CSSDimensions.prototype.isKeyword = function(val){
        var patt = /(^thick$)|(^thin$)|(^medium$)/;
        return (val.match(patt)) ? true : false; };
    adr.CSSDimensions.prototype.isEm = function(val){
        return (val.indexOf('em') !== -1) ? true : false; };
    adr.CSSDimensions.prototype.isPx = function(val){
        return (val.indexOf('px') !== -1) ? true : false; };
    adr.CSSDimensions.prototype.isEx = function(val){
        return (val.indexOf('ex') !== -1) ? true : false; };
    adr.CSSDimensions.prototype.emToPx = function(val){
        var theFig = val.substr(0, val.length - 2);
        theFig *= 16;
        val = Math.round(theFig);
        return val; };
    adr.CSSDimensions.prototype.emToEx = function(val){
        return val; };
    adr.CSSDimensions.prototype.pxToEm = function(val){
        var theFig = val.substr(0, val.length - 2);
        theFig /= 16;
        return theFig; };
    adr.CSSDimensions.prototype.pxToEx = function(val){
        return val; };
    adr.CSSDimensions.prototype.exToEm = function(val){
        return val; };
    adr.CSSDimensions.prototype.exToPx = function(val){
        return val; };
    adr.CSSDimensions.prototype.convertKeyword = function(val){
        //at present uses IE Settings for thick, thin, medium
        switch (val){
            case "thick":
                return "5px";
            case "thin":
                return "1px";
            case "medium":
                return "3px"; }};
    adr.CSSDimensions.prototype.convertToPixels = function(val){
        if(this.isPx(val)){
            return Number(val.substr(0, val.length - 2));
        } else if(this.isEm(val)){
            return Number(this.emToPx(val));
        } else if(this.isEx(val)){
            return Number(this.exToPx(val));
        } else { return undefined; }};
    adr.CSSDimensions.prototype.convertToEm = function(val){
        if(this.isPx(val)){
            return this.pxToEm(val);
        } else if(this.isEm(val)){
            return val.substr(0, val.length-2);
        } else if(this.isEx(val)){
            return this.exToEm(val);
        } else { return undefined; }};
    adr.CSSDimensions.prototype.convertToEx = function(val){
        if(this.isPx(val)){
            return this.pxToEx(val);
        } else if(this.isEm(val)){
            return this.emToEx(val);
        } else if(this.isEx(val)){
            return val.substr(0, val.length-2);
        } else { return undefined; }};

    adr.CSSDimensions.prototype.convert = function(val, toVal){
        if(val === "auto"){ return undefined; }
        if(val === 0){ return 0; }
        if(this.isKeyword(val)){ val = this.convertKeyword(val); }
        var r = '';
        switch(toVal){
            case "px":
                return this.convertToPixels(val);
            case "ex":
                return this.convertToEx(val);
            case "em":
                return this.convertToEm(val);
            default:
                return this.convertToPixels(val);
        }
        return undefined; };
    ut.convertCSSdimensions = adr.CSSDimensions.prototype.convert;
}
