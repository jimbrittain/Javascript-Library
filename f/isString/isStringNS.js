"use strict";
/* global __imns */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isString' in adr)){
    adr.isString = function(v){
        if(v !== null && typeof v === 'string' && v.length > 0){
            var reg = /[a-zA-Z0-9\-\_]+/;
            return reg.test(v); }
        return false;
    };
}
