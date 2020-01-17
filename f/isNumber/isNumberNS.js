"use strict";
/* global __imns */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isNumber' in adr)){
    /**
     * @method isNumber
     * @version 0.2
     * @param {all} n
     * @return {Boolean}
     * @description used to determine if supplied parameter is a Number
     * @notes developed from http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
     **/
    adr.isNumber = function(n){ return (typeof n !== 'undefined' && !isNaN(parseFloat(n)) && isFinite(n)); };
}
