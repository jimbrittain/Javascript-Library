"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isArguments' in adr)){
    adr.isArguments = function(a){
        if(a !== undefined && typeof a === 'object'){
            if(Object.prototype.toString){
                try {
                    return (Object.prototype.toString.call(a) === '[object Arguments]');
                } catch(e){
                   return (Object.prototype.hasOwnProperty.call(a, 'callee') && !Object.prototype.propertyIsEnumerable.call(a, 'callee')); }}}
        return false; };
}
