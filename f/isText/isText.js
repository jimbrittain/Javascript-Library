"use strict";
/**
    @method isText
    @param {String} v
    @return {Boolean}
    @description - confirms is text
 */
function isText(v){
    return (v !== null && typeof v === 'string' && isNaN(Number(v)) && v.length > 0);
}
