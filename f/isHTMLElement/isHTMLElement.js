"use strict";
/*global HTMLElement, IMDebugger, console, window*/
/**
  * @function isHTMLElement
  * @param elem
  * @return {Boolean}
  * @requires IMDebugger (optional)
  * @description finds if supplied parameter is a HTMLElement
 **/
var isHTMLElement = function(elem){
    var hasHTMLElement = false;
    try {
        if(HTMLElement !== undefined) { hasHTMLElement = true;}
    } catch(e1){}
    if(elem !== null && elem !== undefined){
        if(hasHTMLElement && typeof elem === 'object'){
            return ((elem instanceof HTMLElement) ? true : false);
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
                } catch(e3) {} 
                return false;
            }}
    } else {
        if('IMDebugger' in window){
            (new IMDebugger()).pass("isHTMLElement must be supplied something.");
        } else {
            console.log("isHTMLElement must be supplied something."); }
        return false; }};
