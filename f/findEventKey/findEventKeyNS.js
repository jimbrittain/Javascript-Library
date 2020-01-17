"use strict";
/* global window, __imns */
var adr = __imns('util.tools');
// var adr = window; //for stand-alone delete above and uncomment this line
if(!('findEventKey' in adr)){
    adr.findEventKey = function(evt){
        var ut = __imns('util.tools');
        if('key' in evt){
            return evt.key;
        } else if('keyCode' in evt){ return evt.keyCode; }
        return null; };
}
