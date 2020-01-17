"use strict";
/* global window, IMDebugger, $, __imns, document */
var adr = __imns('util.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('ActiveElement' in adr)){
    adr.ActiveElement = function(){
        var uc = __imns('util.classes');
        if(uc.ActiveElement.prototype.singleton !== undefined){
            return uc.ActiveElement.prototype.singleton; }
        uc.ActiveElement.prototype.singleton = this;
        this.activeElement = document;
        this.init(); };
    adr.ActiveElement.prototype.get = function(){
        if('activeElement' in document){
            return document.activeElement;
        } else { return (this.activeElement !== null) ? this.activeElement : document; }};
    adr.ActiveElement.prototype.init = function(){
        if(!('activeElement' in document)){
            var ut = __imns('util.tools');
            var c = this;
            ut.fetter(document, 'focus', [c, function(e){ c.set(e); }], true);
            ut.fetter(document, 'blur', [c, function(e){ c.unset(e); }], true); }};
    adr.ActiveElement.prototype.set = function(e){
        var elem = (__imns('util.tools')).findEventElement(e);
        this.activeElement = elem; };
    adr.ActiveElement.prototype.unset = function(e){
        var elem = (__imns('util.tools')).findEventElement(e);
        this.activeElement = null; };
    adr.ActiveElement.prototype.inside = function(el){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var onElement = this.get();
        if(uv.isHTMLElement(el)){
            var arr = (uv.isHTMLElement(onElement)) ? [onElement] : [];
            var i = 0;
            while(i < arr.length){
                var on = arr[i];
                if(on === el){ 
                    return true; 
                } else {
                    var kids = ('childNodes' in on) ? on.childNodes : (('children' in on) ? on.children : []);
                    arr = arr.concat(ud.htmlNodesToArray(kids)); }
                i += 1; }}
        return false; };
    (__imns('util.tools')).getActiveElement = function(){ return (new (__imns('util.classes')).ActiveElement()).get(); };
//    (function(){ 
        var a = new (__imns('util.classes')).ActiveElement();
 //   })();
}
