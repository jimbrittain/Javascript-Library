"use strict";
/* global __imns, navigator */
var adr = __imns('util.validation');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('isKindle' in adr)){


    adr.isKindle = function(){
        var uv = __imns('util.validation');
        if(uv.isKindle.prototype.found !== undefined){ return uv.isKindle.prototype.found; }
        var string_list = ['Silk', 'Kindle', 'KFAPW', 'KFTHW', 'KFSOW', 'KFJW', 'KFTT', 'KFOT'];
        var ua = navigator.userAgent, l = string_list.length, f=false;
        for(var i=0; i<l; i+=1){ if((new RegExp(string_list[i]).test(ua))){ f = true; break; }}
        uv.isKindle.prototype.found = f;
        return f; };


}
