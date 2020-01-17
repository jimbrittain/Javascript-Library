"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('MediaInterface' in adr)){


    adr.MediaInterface = function(elem){
        this.element = null;
        this.inactiveElems = [];
        this.init(elem);
        this.tags = ['audio', 'video', 'object', 'embed'];
    };
    adr.MediaInterface.prototype.setElement = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        this.element = (uv.isHTMLElement(elem) && uv.isInArray(this.tags, ud.getTagName(elem))) ? elem : this.element;
        return (this.element === elem); };
    adr.MediaInterface.prototype.init = adr.MediaInterface.prototype.setElement;
    adr.MediaInterface.prototype.set = function(property, value){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(uv.isString(property)){
            var arr = this.getMediaChildren();
            arr.unshift(this.element);
            for(var i=0; i<arr.length; i+=1){
                var elem = arr[i];
                if(uv.isHTMLElement(elem) && uv.isInArray(this.tags, ud.getTagName(elem))){
                    try {
                        ud.setAttribute(elem, property, value);
                    } catch(e) {
                        (new (__imns('util.debug')).IMDebugger()).pass('Fault caused by Media Interface Problem on set');
                    }
                }
            }
        }
    };
    adr.MediaInterface.prototype.call = function(method, args){
        var uv = __imns('util.validation');
        if(uv.isString(method)){
            if(method in this.element && uv.isFunction(this.element[method])){
                this.element[method](args);
                return true;
            } else {
                var arr = this.getMediaChildren(),
                    tried = false;
                for(var i=0; i<arr.length; i+=1){
                    var elem = arr[i];
                    if(method in this.element && uv.isFunction(this.element[method])){
                        tried = true;
                        try {
                            elem[method](args);
                        } catch(e){
                            (new (__imns('util.debug')).IMDebugger()).pass('Fault caused by Media Interface Problem on call');
                        }
                    }
                }
                return tried; }}
        return false; };
    adr.MediaInterface.prototype.getMediaChildren = function(){
        var ud = __imns('util.dom'),
            uv = __imns('util.validation');
        var arr = [];
        var children = ('childNodes' in this.element && this.element.childNodes.length > 0) ? ud.htmlNodesToArray(this.element.childNodes) : [];
        for(var i=0; i<this.children.length; i+=1){
            var on = children[i];
            var tc = ud.getTagName(on);
            if(uv.isInArray(this.tags, tc)){ arr.push(on); }
            if('childNodes' in on && on.childNodes.length > 0){ children = children.concat(ud.htmlNodesToArray(on.childNodes)); }}
        return arr; };

}
