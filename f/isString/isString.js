"use strict";
/* global __imns */
var isString = function(v){
    if(v !== null && typeof v === 'string' && v.length > 0){
        var reg = /[a-zA-Z0-9\-\_]+/;
        return reg.test(v); }
    return false;
};

