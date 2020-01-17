"use strict";
/**
 * @method isNumber
 * @param {all} n
 * @return {Boolean}
 * @description - determines if parameter supplied is a Number
 * @notes http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
 **/
function isNumber(n){ return (n !== 'undefined' && !isNaN(parseFloat(n)) && isFinite(n)); }
