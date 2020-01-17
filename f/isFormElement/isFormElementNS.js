"use strict";
/* global window, IMDebugger, $, __imns, HTMLFormElement */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isFormElement' in adr)){
    adr.isFormElement = function(elem){
        var uv = __imns('util.validation'),
            ut = __imns('util.tools');
        if(elem !== undefined && uv.isHTMLElement(elem)){
            if('HTMLFormElement' in window){
                return elem instanceof HTMLFormElement;
            } else {
                var tn = ut.getTagName(elem);
                return (tn === 'form'); }}
        return false; };
}
