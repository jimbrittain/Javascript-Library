"use strict";
/* global window, document, self, __imns */
var adr = __imns('component.classes');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('Framer' in adr)){
    adr.Framer = function(){
        this.done = false;
        this._unframed = null;
        this._framed = null;
        this._window = null; };
//Framer.prototype.shouldBeFramed = function(){ return (this.framed() && !this.unframed()) ? true : false; };
    adr.Framer.prototype.isFramed = function(){
        var test = false, theWindow = ('defaultView' in document) ? document.defaultView : window;
        try {
            return (theWindow.self !== theWindow.top);
        } catch(e) {}
        if('parent' in window && 'location' in window.parent && self && 'location' in self){
            try {
                return (window.parent.location !== self.location);
            } catch(e) {}}
        if('frameElement' in window){ return (window.frameElement !== null); }
        return ('parent' in window && window.parent !== undefined) ? true : false; };
//element in frame?

    adr.Framer.prototype.unframe = function(iframeElem, outerElem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        this.done = true;
        var redirected = false, removed = true, theOuter = null;
        if(iframeElem !== undefined && uv.isHTMLElement(iframeElem)){
            var source = ud.getAttribute(iframeElem, 'src');
            if(source !== ''){
                if('open' in window){
                    this._window = window.open(source, '_blank');
                    redirected = (this._window !== null && this._window !== undefined && ('closed' in this._window && !this._window.closed)) ? true : false;
                } else if('top' in window) {
                    window.top.location = source;
                    redirected = true; }
                theOuter = (redirected && outerElem !== undefined && uv.isHTMLElement(outerElem) && uv.isChildOf(iframeElem, outerElem)) ? outerElem : iframeElem;
                if(redirected && theOuter !== undefined && uv.isHTMLElement(theOuter)){
                    if('remove' in theOuter){
                        theOuter.remove();
                        return true;
                    } else if('parentNode' in theOuter){
                        theOuter.parentNode.removeChild(theOuter);
                        return true; }}}}
        var udb = __imns('util.debug');
        (new udb.IMDebugger()).pass('You need to write a catch for pop-up blocking');
        return false; };
}
