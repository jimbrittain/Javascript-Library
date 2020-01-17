"use strict";
/*global HTMLElement, __imns, window, console */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isHTMLElement' in adr)){
    /**
    @namespace util.validation
    @method isHTMLElement
    @version 1.0.0
    @param {all} elem
    @return {Boolean}
    @description attempts to ascertain whether param is a HTMLElement
     */
    adr.isHTMLElement = function(elem){
        var tdb = __imns('util.debug');
        var hasHTMLElement = false;
        try {
            if(typeof HTMLElement !== 'undefined') { hasHTMLElement = true;}
        } catch(e1){}
        if(elem !== null && typeof elem !== 'undefined'){
            if(hasHTMLElement && typeof elem === 'object' && elem instanceof HTMLElement){
                return true;
                //return ((elem instanceof HTMLElement) ? true : false);
            } else {
                try {
                    if('nodeType' in elem){ return ((elem.nodeType === 1) ? true : false);
                    } else if('tagName' in elem){ return (elem.tagName !== null) ? true : false;
                    } else { return ('canHaveHTML' in elem) ? true : false; }
                } catch(e2) {
                    try {
                        if(elem.nodeType){ return ((elem.nodeType === 1) ? true : false); 
                        } else if(elem.tagName){ return (elem.tagName !== null) ? true : false; 
                        } else { return (elem.canHaveHTML) ? true : false; }
                    } catch(e3) {}}}
            return false;
        } else {
            if('IMDebugger' in tdb){
                (new tdb.IMDebugger()).pass("isHTMLElement must be supplied something.");
            } else {
                console.log("isHTMLElement must be supplied something."); }
            return false; }};
}
