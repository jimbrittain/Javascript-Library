"use strict";
/* global window, IMDebugger, $, __imns, console */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isArray' in adr)){
    /**
     * @namespace util.validation
     * @method isArray
     * @param {all} o
     * @return {Boolean}
     * @requires - IMDebugger, __imns
     * @description Attempts to determine whether o is an Array;
     */
    adr.isArray = function(o){
        if(Object && Object.prototype){
            return (Object.prototype.toString.call(o) === "[object Array]");
        } else if(Array && Array.isArray){
            return Array.isArray(o);
        } else if('jquery' in window){
            return $.isArray(o);
        } else if(Array){ return (o instanceof Array);
        } else { 
            var udb = __imns('util.debug');
            if('IMDebugger' in udb){
                (new udb.IMDebugger()).pass("Could not determine if object is an Array with isArray");
            } else { console.log('Could not determine if object is an Array with isArray'); }
            return false; }};
}
