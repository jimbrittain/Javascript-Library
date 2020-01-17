"use strict";
/* global window, IMDebugger, $, __imns, console */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findForm' in adr)){
    adr.findForm = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        var f = null;
        if(elem !== null && uv.isHTMLElement(elem)){
            if(uv.isFormElement(elem)){
                f = elem;
            } else if(elem.form && elem.form !== null){ 
                f = elem.form; 
            } else if(window.jquery){
                f = $(elem).closest('form')[0];
                f = (!uv.isHTMLElement(f)) ? null : f;
            } else {
                var e = elem;
                while(e !== null && uv.isHTMLElement(e)){
                    e = (e.parentNode) ? e.parentNode : ((e.parentElement) ? e.parentElement : null);
                    if(e.tagName && e.tagName.toLowerCase() === 'form'){
                        f = e;
                        e = null; }}}}
        return f;};
}
