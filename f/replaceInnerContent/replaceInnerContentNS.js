"use strict";
/* global __imns */
var adr = __imns('util.dom');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('replaceInnerContent' in adr)){

    
    adr.replaceInnerContent = function(elem, replacement){
        var uv = __imns('util.validation');
        if(elem !== undefined && uv.isHTMLElement(elem) && typeof replacement === 'string'){
            if('innerHTML' in elem){
                elem.innerHTML = replacement;
                return true;
            } else if('textContent' in elem && typeof replacement === 'string'){
                elem.textContent = replacement;
                return true;
            } else { return false; }
        } else { return false; }};

}
