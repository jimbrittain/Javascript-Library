"use strict";
/* global window, IMDebugger, $, __imns, HTMLDataListElement, HTMLKeygenElement, HTMLInputElement, HTMLMeterElement, HTMLOptGroupElement, HTMLOptionElement, HTMLOutputElement, HTMLSelectElement, HTMLTextAreaElement */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isFormControlElement' in adr)){
    adr.isFormControlElement = function(elem){
        var uv = __imns('util.validation'),
            ud = __imns('util.dom');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            if('HTMLFormElement' in window){
                if(elem instanceof HTMLDataListElement){ return true; }
                if(elem instanceof HTMLKeygenElement){ return true; }
                if(elem instanceof HTMLInputElement){ return true; }
                if(elem instanceof HTMLMeterElement){ return true; }
                if(elem instanceof HTMLOptGroupElement){ return true; }
                if(elem instanceof HTMLOptionElement){ return true; }
                if(elem instanceof HTMLOutputElement){ return true; }
                if(elem instanceof HTMLSelectElement){ return true; }
                if(elem instanceof HTMLTextAreaElement){ return true; }
            } else {
                var tn = ud.getTagName(elem);
                switch (tn){
                    case 'datalist':
                    case 'keygen':
                    case 'input':
                    case 'meter':
                    case 'optgroup':
                    case 'option':
                    case 'output':
                    case 'select':
                    case 'textarea':
                        return true; }}}
        return false; };
}
