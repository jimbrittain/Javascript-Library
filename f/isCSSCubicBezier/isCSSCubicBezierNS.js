"use strict";
/*global __imns */
/*jshint -W044 */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isCSSCubicBezier' in adr)){
    /**
     * @function isCSSCubicBezier
     * @version 1.0.0
     * @param {String} s
     * @return {Boolean}
     * @description Regular Expression check for if a string is correctly formatted as CSS Cubic Bezier definition;
     */
    adr.isCSSCubicBezier = function(s){
        if(typeof s !== 'string'){ return false; }
        var reg = '^cubic-bezier\(((0(\.[0-9]+)?)|(1(\.[0]+)?)),[ ]*([-+]?[0-9]*\.?[0-9]+),[ ]*((0(\.[0-9]+)?)|(1(\.[0]+)?)),[ ]*([-+]?[0-9]*\.?[0-9]+)\)$';
        reg = new RegExp(reg);
        return reg.test(s); };


}
