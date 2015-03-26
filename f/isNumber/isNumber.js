"use strict";
/**
 * @method isNumber
 * @param {all} n
 * @notes http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
 */

function isNumber(n){ return !isNaN(parseFloat(n)) && isFinite(n); } 
