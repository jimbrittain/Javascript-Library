"use strict";
/* global window, IMDebugger, $, console */
/**
 * @function isArray
 * @param {all} o
 * @return {Boolean}
 * @requires IMDebugger
 * @description Attempts to determine whether o is an Array;
 */
function isArray(o){
    if(Object && Object.prototype){
        return (Object.prototype.toString.call(o) === "[object Array]");
    } else if(Array && Array.isArray){
        return Array.isArray(o);
    } else if('jquery' in window){
        return $.isArray(o);
    } else if(Array){ return (o instanceof Array);
    } else { 
        if('IMDebugger' in window){
            (new IMDebugger()).pass("Could not determine if object is an Array with isArray");
        } else { console.log('Could not determine if object is an Array with isArray'); }
        return false; }}
