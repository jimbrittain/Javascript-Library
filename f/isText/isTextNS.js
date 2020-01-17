"use strict";
/* global __imns */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isText' in adr)){
    /**
        @method isText
        @param {String} v
        @return {Boolean}
        @description - confirms is text
     */
    adr.isText = function(v){
        return (v !== null && typeof v === 'string' && isNaN(Number(v)) && v.length > 0);
    };


}
