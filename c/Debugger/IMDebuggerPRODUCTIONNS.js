"use strict";
/* global __imns */
var adr = __imns('util.debug');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('IMDebugger' in adr)){
    adr.IMDebugger = function(){};
    adr.IMDebugger.prototype.pass = function(){};
}
