"use strict";
/* global __imns */
var adr = __imns('util.classes'), ud = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('HTMLClass' in adr)){

    
    /**
     * @module util.dom.addClass, util.dom.removeClass, util.dom.hasClass, util.classes.HTMLClass
     */
    adr.HTMLClass = function() {
        var uc = __imns('util.classes');
        if(uc.HTMLClass.prototype.singleton !== undefined){ 
            return uc.HTMLClass.prototype.singleton; }
        uc.HTMLClass.prototype.singleton = this; };

    adr.HTMLClass.prototype.returnClasses = function(str){
        if(typeof str === 'string'){
            if(str.length > 0){
                if(str.indexOf(" ") !== -1){
                    var arr = str.split(" ");
                    return arr;
                } else { return [str]; }
            } else { return []; }
        } else { return []; }};

    adr.HTMLClass.prototype.validClassName = function(n){
        //add validater, difficult as some browsers allow non-syntatic class names.
        return true; };

    adr.HTMLClass.prototype.hasClass = function(o, n){ //probably should validate, strip classname (n)
        var uc = __imns('util.classes'), uv = __imns('util.validation');
        var current = (o !== undefined && uv.isHTMLElement(o)) ? (new uc.Attributer()).get(o, 'class') : "";
        current = this.returnClasses(current);
        if(current.length > 0){
            var found = false;
            for(var i=0, imax = current.length; i < imax; i += 1){
                if(current[i] === n){
                    found = true;
                    break; }}
            return found;
        } else { return false; }};

    adr.HTMLClass.prototype.addClass = function(o, n){
        var uc = __imns('util.classes'),
            uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(!this.hasClass(o, n)){
            var current = (o !== undefined && uv.isHTMLElement(o)) ? (new uc.Attributer()).get(o, 'class') : "";
            current = this.returnClasses(current);
            current.push(n);
            var newClassStr = current.join(" ");
            return ud.setAttribute(o, 'class', newClassStr);
        } else { return false; }};

    adr.HTMLClass.prototype.removeClass = function(o, n){
        var uc = __imns('util.classes'),
            uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(this.hasClass(o, n)){
            var current = (o !== undefined && uv.isHTMLElement(o)) ? (new uc.Attributer()).get(o, 'class') : "";
            current = this.returnClasses(current);
            for(var i = 0, imax = current.length; i < imax; i += 1){
                if(current[i] === n){
                    current.splice(i, 1); //doesn't break in case error means > 1
                    i -= 1; }}
            return ud.setAttribute(o, 'class', current.join(" "));
        } else { return true; }};

    ud.hasClass = function(o, n){
        var uc = __imns('util.classes');
        return (new uc.HTMLClass()).hasClass(o,n); };
    ud.addClass = function(o, n){
        var uc = __imns('util.classes');
        return (new uc.HTMLClass()).addClass(o,n); };
    ud.removeClass = function(o, n){
        var uc = __imns('util.classes');
        return (new uc.HTMLClass()).removeClass(o,n); };
}
