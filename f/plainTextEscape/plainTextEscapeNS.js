"use strict";
/* global window, IMDebugger, $, __imns, FormData, escape */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if (!('plainTextEscape' in adr)) {
    adr.plainTextEscape = function(str){
        //adapted from https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
        return ((__imns('util.validation')).isString(str)) ? str.replace(/[\s\=\\]/g, "\\$&") : str;
    };
}
