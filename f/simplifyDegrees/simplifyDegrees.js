"use strict";
/* global window, IMDebugger, $, __imns */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('simplifyDegrees' in adr)){
    adr.simplifyDegrees = function(deg){
        var uv = __imns('util.validation');
        if(uv.isNumber(deg)){
            deg = deg % 360;
            return (deg < 0) ? 360 + deg : deg; 
        } else { return deg; }
    };
}
