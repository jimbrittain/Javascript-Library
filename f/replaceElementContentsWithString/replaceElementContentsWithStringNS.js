"use strict";
/* global IMDebugger, __imns, util.validation.isHTMLElement, findElementByID, */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('replaceElementContentsWithString' in adr)){
    

    /**
        @method replaceElementContentsWithString
        @param {Element|String} targetElement - if string attempts to getElementById(targetElement)
        @param {String} textContent - replacement string, may be html
        @return {Boolean} Success?
        @description replace the internal contents of element (or element from id) with supplied string
     */
    adr.replaceElementContentsWithString = function(targetElement, textContent){
        var ud = __imns('util.dom'), uv = __imns('util.validation'), udb = __imns('util.debug');
        targetElement = (typeof targetElement === 'string') ? ud.findElementByID(targetElement) : targetElement;
        if(targetElement !== undefined && uv.isHTMLElement(targetElement) && typeof textContent === 'string'){
            if(targetElement.appendChild){
                var arr = (targetElement.childNodes) ? targetElement.childNodes : ((targetElement.children) ? targetElement.children : []);
                while(arr.length > 0){ 
                    var lastLength = arr.length;
                    targetElement.removeChild(arr[0]); 
                    if(arr.length === lastLength){  
                        (new udb.IMDebugger()).pass('replaceElementContentsWithString failed');
                        break; }}
                targetElement.innerHTML = textContent;
                return true; }}
        return false; };


}
